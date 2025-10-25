import React, { useState, useRef } from 'react';
import { ArrowRight, ChevronsRight } from 'lucide-react';

const SlideToUpdateButton = ({ handleStatusUpdate, canUpdate, updating }) => {
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const containerRef = useRef(null);

  const buttonWidth = 300;
  const handleWidth = 50;

  const handleDragStart = (e) => {
    if (!canUpdate || updating) return;
    setDragging(true);
  };

  const handleDragMove = (e) => {
    if (!dragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - handleWidth / 2;
    const newPosition = Math.min(Math.max(x, 0), buttonWidth - handleWidth);
    setDragPosition(newPosition);
  };

  const handleDragEnd = () => {
    if (dragPosition >= buttonWidth - handleWidth - 10) {
      handleStatusUpdate(); // trigger action
    }
    setDragging(false);
    setDragPosition(0);
  };

  const buttonText = updating ? 'Updating...' : 'Slide to Update';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-12"
      style={{ maxWidth: `100%` }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
        <span className="font-semibold text-gray-700">{buttonText}</span>
      </div>

      {/* Sliding overlay */}
      <div
        className="absolute top-0 left-0 h-full  bg-blue-500 rounded-full transition-all duration-200 flex items-center"
        style={{ width: `${dragPosition + handleWidth}px` }}
      >
        <div
          className="w-10 h-10 bg-white items-center mx-auto rounded-full flex items-center justify-center shadow-md cursor-pointer ml-auto mr-1"
        >
          <ChevronsRight size={29} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default SlideToUpdateButton;
