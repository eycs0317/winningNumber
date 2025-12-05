'use client';
// components/WheelPicker.tsx
import React, { useRef, useState, useEffect } from 'react';

// Define the shape of a single item
interface WheelItem {
  value: string;
}

interface WheelPickerProps {
  items: WheelItem[];
  // New: Function to call when the spin button is clicked
  onSpin: () => string; // Should return the value that was "randomly" selected
  // Function to call when an item is selected after spin stops
  onSelect: (value: string) => void;
  visibleItems?: number;
}

const itemHeight = 40; // Must match CSS height

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  onSpin,
  onSelect,
  visibleItems = 5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- Core Functions ---

  // 1. Scrolls to a specific item index
  const scrollToItem = (index: number) => {
    if (!containerRef.current) return;
    const centerOffset = Math.floor(visibleItems / 2) * itemHeight;
    const scrollPosition = index * itemHeight - centerOffset;

    containerRef.current.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
    setSelectedIndex(index);
    onSelect(items[index].value);
  };

  // 2. Handles the Spin Button Click
  const handleSpin = () => {
    if (isSpinning) return;

    // 1. Start the visual spinning effect
    setIsSpinning(true);

    // 2. Call the external function to determine the winning value
    // This value would ideally come from a server-side calculation (Prisma/API).
    const winningValue = onSpin();

    // 3. Find the index of the winning value
    const winnerIndex = items.findIndex(item => item.value === winningValue);

    if (winnerIndex === -1) {
      console.error("Winning value not found in items.");
      setIsSpinning(false);
      return;
    }

    // --- Spinning Simulation ---
    // Simulate a randomized spin duration and rotation
    const spinDurationMs = 3000;
    const randomExtraTurns = Math.floor(Math.random() * 5) + 5; // Spin 5-9 full turns
    const finalTargetIndex = winnerIndex + (items.length * randomExtraTurns);
    const totalScrollDistance = finalTargetIndex * itemHeight;

    if (containerRef.current) {
        // Apply the transform animation to the entire container (wheel-items)
        containerRef.current.style.transition = `transform ${spinDurationMs / 1000}s ease-out`;
        // Use a high negative transform to simulate fast scrolling
        // Note: For a true wheel, we'd wrap the content and use CSS rotation.
        // For a scroll picker, we can animate the scroll position or use CSS transform.
        // A simple `scrollTo` is cleaner for this model:
        const centerOffset = Math.floor(visibleItems / 2) * itemHeight;
        containerRef.current.scrollTo({
            top: (winnerIndex * itemHeight) - centerOffset,
            behavior: 'smooth' // We use smooth here, but for a fast spin, you'd use a temporary CSS animation class
        });
    }

    // 4. Stop the spin and finalize selection after the duration
    setTimeout(() => {
      // Ensure the component is not using the CSS transform animation anymore
      if (containerRef.current) {
        containerRef.current.style.transition = 'none';
      }

      setIsSpinning(false);
      // Ensure final scroll position is correct
      scrollToItem(winnerIndex);
    }, spinDurationMs);
  };

  // Initial scroll to the center item on load
  useEffect(() => {
    scrollToItem(selectedIndex);
  }, []);

  // --- Render ---
  return (
    <div className="wheel-picker-container" style={{ height: `${itemHeight * visibleItems}px` }}>

      {/* The main scrolling list area */}
      <div
        ref={containerRef}
        className={`wheel-items ${isSpinning ? 'spinning' : ''}`}
        // Prevent manual scrolling while spinning is active
        onScroll={(e) => {
          if (isSpinning) e.preventDefault();
        }}
        // The wheel is sized by the component's total height
      >
        {items.map((item, index) => (
          <div
            key={item.value}
            className={`wheel-item ${index === selectedIndex ? 'selected' : ''}`}
            style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }}
            onClick={() => !isSpinning && scrollToItem(index)}
          >
            {item.value}
          </div>
        ))}
      </div>

      {/* The Spin Button in the center (Overlay) */}
      <div className="spin-button-overlay">
        <button
          className="spin-button"
          onClick={handleSpin}
          disabled={isSpinning}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN'}
        </button>
      </div>

    </div>
  );
};

export default WheelPicker;