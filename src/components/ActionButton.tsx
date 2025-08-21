import React, { useState, useRef, useEffect } from 'react';
import type { ActionButton } from '../types/action';

interface ActionResponse {
  buttonId: string;
  status: number;
  statusText: string;
  response: string;
  success: boolean;
}

interface ActionButtonProps {
  button: ActionButton;
  buttonNumber: number;
  onTrigger: (buttonId: string) => void;
  onDrag: (buttonId: string, position: { x: number; y: number }) => void;
  onEdit: () => void;
  response?: ActionResponse;
  snapToGrid: (value: number) => number;
  isDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const ActionButtonComponent: React.FC<ActionButtonProps> = ({
  button,
  buttonNumber,
  onTrigger,
  onDrag,
  onEdit,
  response,
  snapToGrid,
  isDragged,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showResponse, setShowResponse] = useState(false);
  const [isTriggering, setIsTriggering] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (response && response.buttonId === button.id) {
      setShowResponse(true);
      setIsTriggering(false);
      const timer = setTimeout(() => setShowResponse(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [response, button.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    e.preventDefault();
    e.stopPropagation();

    if (e.detail === 2) {
      // Double click to edit
      onEdit();
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    onDragStart();

    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const newX = snapToGrid(e.clientX - dragOffset.x);
      const newY = snapToGrid(e.clientY - dragOffset.y);

      // Keep button within bounds
      const maxX = window.innerWidth - 120;
      const maxY = window.innerHeight - 40;

      const clampedX = Math.max(0, Math.min(maxX, newX));
      const clampedY = Math.max(0, Math.min(maxY, newY));

      onDrag(button.id, { x: clampedX, y: clampedY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDragging) {
      setIsTriggering(true);
      onTrigger(button.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit();
  };

  const getStatusColor = () => {
    if (!response) return '';
    if (response.success) return 'ring-2 ring-green-500';
    return 'ring-2 ring-red-500';
  };

  const getResponseIcon = () => {
    if (!response) return null;
    if (response.success) return '✓';
    return '✗';
  };

  return (
    <>
      <div
        ref={buttonRef}
        className={`
          action-button absolute cursor-pointer select-none rounded-lg shadow-lg relative
          ${isDragged ? 'z-20' : 'z-10'}
          ${isDragging ? 'dragging' : ''}
          ${isTriggering ? 'triggering' : ''}
          ${getStatusColor()}
        `}
        style={{
          left: `${button.position.x}px`,
          top: `${button.position.y}px`,
          backgroundColor: button.backgroundColor,
          color: button.textColor,
          minWidth: '140px',
          minHeight: '60px',
          padding: '12px 16px',
          border: `2px solid ${button.backgroundColor}`,
          borderRadius: '12px'
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        title={`Button ${buttonNumber}: ${button.label}\n${button.method} ${button.url}\nDouble-click to configure`}
      >
        {/* Button Number Badge */}
        <div className="button-number">
          {buttonNumber}
        </div>
        
        {/* Button Content */}
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm truncate max-w-[90px]" title={button.label}>
              {button.label}
            </span>
            {response && (
              <span className="ml-2 text-xs">
                {getResponseIcon()}
              </span>
            )}
          </div>
          <div className="text-xs opacity-75 mt-1 font-medium">
            {button.method}
          </div>
        </div>

        {/* Loading indicator */}
        {isTriggering && (
          <div className="absolute top-2 right-8">
            <div className="spinner"></div>
          </div>
        )}
      </div>

      {/* Response Popup */}
      {showResponse && response && (
        <div
          className="absolute z-30 bg-white text-black p-3 rounded-lg shadow-lg max-w-xs"
          style={{
            left: `${button.position.x}px`,
            top: `${button.position.y + 60}px`,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`font-semibold ${response.success ? 'text-green-600' : 'text-red-600'}`}>
              {response.status} {response.statusText}
            </span>
            <button
              onClick={() => setShowResponse(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
            {response.response}
          </div>
        </div>
      )}
    </>
  );
};

export default ActionButtonComponent;
