import React, { useState, useRef, useEffect } from "react";
import { ChevronsRight } from "lucide-react";

const SlideToUpdateButton = ({ handleStatusUpdate, canUpdate, updating }) => {
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const containerRef = useRef(null);
  const handleWidth = 50;

  // 🧩 Helper to get correct X coordinate for both touch & mouse
  const getClientX = (e) => {
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    return e.clientX;
  };

  // 🎯 Start dragging
  const handleDragStart = (e) => {
    if (!canUpdate || updating) return;
    setDragging(true);
    e.preventDefault(); // prevent text/image drag
  };

  // 🧠 Handle movement
  const handleDragMove = (e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = getClientX(e) - rect.left - handleWidth / 2;
    const newPosition = Math.min(Math.max(x, 0), rect.width - handleWidth);
    setDragPosition(newPosition);
  };

  // 🏁 End drag
  const handleDragEnd = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // If dragged near end → trigger update
    if (dragPosition >= rect.width * 0.8) {
      handleStatusUpdate();
    }

    // Reset position smoothly
    setDragging(false);
    setDragPosition(0);
  };

  // 💫 Add event listeners for desktop mouse dragging
  useEffect(() => {
    const handleMouseUp = () => {
      if (dragging) handleDragEnd();
    };
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [dragging, dragPosition]);

  const buttonText = updating ? "Updating..." : "Slide to Update";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-12 select-none"
      style={{
        maxWidth: "320px",
        touchAction: "none", // disable scroll while sliding
        userSelect: "none",
      }}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
        <span className="font-semibold text-gray-700">{buttonText}</span>
      </div>

      {/* Blue Sliding Area */}
      <div
        className="absolute top-0 left-0 h-full bg-blue-500 rounded-full flex items-center transition-[width] duration-100 ease-out"
        style={{ width: `${dragPosition + handleWidth}px` }}
      >
        {/* Handle Button */}
        <div
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing ml-auto mr-1 transition-transform duration-150"
          style={{
            transform: dragging ? "scale(1.05)" : "scale(1)",
          }}
        >
          <ChevronsRight size={28} className="text-blue-500" />
        </div>
      </div>
    </div>
  );
};

export default SlideToUpdateButton;
