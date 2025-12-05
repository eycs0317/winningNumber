'use client'
// components/RouletteWheel.tsx
import React, { useState, useRef } from 'react';

interface WheelItem {
  value: string;
}

interface RouletteWheelProps {
  items: WheelItem[];
  onSpin: () => string;
  onSelect: (value: string) => void;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ items, onSpin, onSelect }) => {
  const [currentRotation, setCurrentRotation] = useState(0); // Current rotation angle of the wheel (0 to 360)
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // --- Calculations for the 3D Layout ---
  const numItems = items.length;
  const itemAngle = 360 / numItems; // Angle between each item

  // NOTE: These dimensions are critical and must match the CSS
  const itemWidth = 100; // Width of a single item block
  // Calculated Radius R: R = w / (2 * tan(180/n))
  const cylinderRadius = Math.round(itemWidth / (2 * Math.tan(Math.PI / numItems)));

  // --- Spin Logic ---
  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // 1. Determine the winning value (e.g., from an API call)
    const winningValue = onSpin();
    const winnerIndex = items.findIndex(item => item.value === winningValue);

    if (winnerIndex === -1) {
        setIsSpinning(false);
        return;
    }

    // 2. Calculate the target rotation
    // A. Start by aiming for the winning item's center:
    const baseTargetRotation = winnerIndex * itemAngle;

    // B. Add random full rotations (e.g., 5-9 full turns) to make it look like a spin
    const randomTurns = Math.floor(Math.random() * 5) + 5;
    const extraRotation = randomTurns * 360;

    // C. Add a slight random offset to make it look less predictable (e.g., +/- 10 degrees)
    const randomOffset = Math.random() * 20 - 10; // -10 to +10 degrees

    // D. The total new rotation is the previous rotation + the spin amount
    // We target the winning item to land at the bottom/center (180 degrees from 0-index)
    // The wheel should stop with the center of the winning item at the pointer.
    // Since items start on the edge, we need to adjust the target:
    // Let's assume the pointer is at the '0' position (top).
    // The wheel must be rotated by an angle that brings the winning item to 0.

    // We are rotating the wheel *against* the item position:
    const totalNewRotation = currentRotation + extraRotation + (360 - baseTargetRotation) + randomOffset;

    // 3. Set the new rotation state
    setCurrentRotation(totalNewRotation);

    // 4. Finalize selection after the spin animation ends (must match CSS transition duration)
    const spinDurationMs = 5000; // 5 seconds
    setTimeout(() => {
        setIsSpinning(false);
        // Normalize the rotation back to 0-360 range without stopping the visual spin
        const finalNormalizedRotation = totalNewRotation % 360;
        // Note: For a true spin, you might need to save the `finalNormalizedRotation`
        // for the next spin's start point, but for simplicity, we keep accumulating the total.
        onSelect(winningValue);
    }, spinDurationMs);
  };

  return (
    <div className="roulette-scene">
      {/* The pointer/indicator fixed at the top */}
      <div className="roulette-pointer">▼</div>

      {/* The wheel container that rotates */}
      <div
        ref={wheelRef}
        className={`roulette-wheel ${isSpinning ? 'spinning' : ''}`}
        style={{
          transform: `translateZ(-${cylinderRadius}px) rotateY(${currentRotation}deg)`,
          // If spinning, the transition is smooth; otherwise, it's instant for setup
          transition: isSpinning ? 'transform 5s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
        }}
      >
        {items.map((item, index) => {
          // Position each item block around the cylinder
          const rotateY = index * itemAngle;
          return (
            <div
              key={item.value}
              className="wheel-item-face"
              style={{
                transform: `rotateY(${rotateY}deg) translateZ(${cylinderRadius}px)`,
                width: `${itemWidth}px`,
              }}
            >
              {item.value}
            </div>
          );
        })}
      </div>

      {/* The center spin button - outside the rotating wheel */}
      <div className="spin-button-area">
          <button
            className="spin-button"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? 'SPINNING...' : 'ROULETTE SPIN'}
          </button>
      </div>

    </div>
  );
};

export default RouletteWheel;