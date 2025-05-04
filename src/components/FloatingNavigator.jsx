import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Move } from 'lucide-react';

const FloatingNavigator = () => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('floatingNavigatorPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  useEffect(() => {
    // Save position to localStorage whenever it changes
    localStorage.setItem('floatingNavigatorPosition', JSON.stringify(position));
  }, [position]);

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('draggable')) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - startPos.x;
      const newY = e.clientY - startPos.y;
      
      // Keep within bounds
      const maxX = window.innerWidth - 60;
      const maxY = window.innerHeight - 60;
      
      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startPos]);

  const scrollTo = (direction) => {
    const scrollDistance = window.innerHeight * 0.8;
    
    switch (direction) {
      case 'top':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'bottom':
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
        break;
      case 'up':
        window.scrollBy({ top: -scrollDistance, behavior: 'smooth' });
        break;
      case 'down':
        window.scrollBy({ top: scrollDistance, behavior: 'smooth' });
        break;
      case 'left':
        window.scrollBy({ left: -300, behavior: 'smooth' });
        break;
      case 'right':
        window.scrollBy({ left: 300, behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className="fixed z-50"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Main FAB Button */}
      <div 
        className={`draggable bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg cursor-move transition-all duration-300 ${
          showControls ? 'scale-110' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <Move size={24} />
      </div>

      {/* Navigation Controls */}
      <div 
        className={`absolute transition-all duration-300 ${
          showControls ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Up Button */}
        <button
          onClick={() => scrollTo('up')}
          className="absolute -top-14 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
          title="Scroll Up"
        >
          <ChevronUp size={20} />
        </button>

        {/* Down Button */}
        <button
          onClick={() => scrollTo('down')}
          className="absolute top-14 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
          title="Scroll Down"
        >
          <ChevronDown size={20} />
        </button>

        {/* Left Button */}
        <button
          onClick={() => scrollTo('left')}
          className="absolute left-1/2 -translate-x-full -translate-y-1/2 -ml-14 top-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
          title="Scroll Left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Button */}
        <button
          onClick={() => scrollTo('right')}
          className="absolute left-1/2 translate-x-full ml-14 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg"
          title="Scroll Right"
        >
          <ChevronRight size={20} />
        </button>

        {/* Quick Actions */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-20">
          <div className="flex gap-2">
            <button
              onClick={() => scrollTo('top')}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-3 py-1 text-sm shadow-lg"
            >
              Top
            </button>
            <button
              onClick={() => scrollTo('bottom')}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full px-3 py-1 text-sm shadow-lg"
            >
              Bottom
            </button>
          </div>
        </div>
      </div>

      {/* Position Indicator */}
      {showControls && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
          x: {Math.round(position.x)}, y: {Math.round(position.y)}
        </div>
      )}
    </div>
  );
};

export default FloatingNavigator;