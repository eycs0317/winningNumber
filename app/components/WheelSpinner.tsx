'use client';
import React, { useRef, useEffect, useState } from 'react';

// Define the shape of the props
interface WheelSpinnerProps {
  range: number;
  items: string[];
  size?: number;
  duration?: number;
  winningIndex: number;     // The index that determines the "win" condition
  onFinish?: (landedIndex: number, didWin: boolean) => void;
}

export default function WheelSpinner({
  range,
  items,
  size = 300,
  duration = 4000,
  winningIndex,
  onFinish,
}: WheelSpinnerProps) {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [angle, setAngle] = useState(0); // Current rotation angle in radians
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const spinning = useRef(false);

  // Determine the number of slices and labels
  const total = Math.max(2, range);
  const labels = Array.from({ length: total }).map((_, i) =>
    items[i] ?? `Item ${i + 1}`
  );

  const sliceAngle = (2 * Math.PI) / total;
  const sliceAngleDegrees = 360 / total;

  // --- Drawing Logic (Remains the same as before) ---
  const drawWheel = (ctx: CanvasRenderingContext2D, r: number) => {
    labels.forEach((label, i) => {
      const start = i * sliceAngle;
      const end = start + sliceAngle;

      // Draw the slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, start, end);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#f9a825' : '#ffecb3';
      ctx.fill();
      ctx.stroke();

      // Draw the text
      ctx.save();
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000';
      ctx.fillText(label, r - 10, 5);
      ctx.restore();
    });
  };

  useEffect(() => {
    // ... drawing context setup remains the same ...
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const r = size / 2;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // 1. Draw the Rotating Wheel
    ctx.translate(r, r);
    ctx.rotate(angle);
    drawWheel(ctx, r);

    // 2. Draw the Fixed Pointer
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(r, r);

    ctx.beginPath();
    ctx.moveTo(0, -r + 10);
    ctx.lineTo(12, -r + 40);
    ctx.lineTo(-12, -r + 40);
    ctx.closePath();
    ctx.fillStyle = '#e53935';
    ctx.fill();
  }, [angle, labels, size, sliceAngle]);

  // --- Spin and Animation Logic ---
  const spin = () => {
    if (spinning.current) return;
    spinning.current = true;

    // 1. Determine a new random landing index for the animation
    const targetIndex = Math.floor(Math.random() * total);

    // 2. Calculate the required rotation angle (in degrees).
    // This is the same logic as before, but it uses the random 'targetIndex'.
    // The items are drawn from 0 degrees (right) clockwise. The pointer is at 270 degrees.
    const centerAngleOfTarget = (targetIndex * sliceAngleDegrees) + (sliceAngleDegrees / 2);

    let rotationToTarget = 270 - centerAngleOfTarget;
    if (rotationToTarget < 0) {
        rotationToTarget += 360;
    }

    // 3. Define the total target rotation
    // Add extra random rotation (up to a full slice) to make the spin look less predictable
    const randomOffset = Math.random() * (sliceAngleDegrees * 0.9);

    const targetAngle =
      360 * 6 + // 6 full spins for visual effect
      rotationToTarget +
      randomOffset; // Random offset within the target slice

    const start = performance.now();

    // --- Animation Loop ---
    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Convert target angle (degrees) to radians for the canvas
      const newAngle = (targetAngle * easeOut * Math.PI) / 180;
      setAngle(newAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning.current = false;

        // --- KEY CHANGE: Calculate the actual landed index ---

        // 1. Normalize the final angle to 0-360 degrees
        const finalAngleDegrees = (targetAngle % 360);

        // 2. Find the angle where the pointer stopped (relative to the positive X-axis).
        // Since the wheel rotated by finalAngleDegrees, the item at that angle moved to the pointer.
        // We need to find which item lands at the 270-degree pointer.

        // The rotation needed to bring the 0-index back to 270 degrees is (360 - finalAngleDegrees).
        const normalizedLandingAngle = (360 - finalAngleDegrees + 270) % 360;

        // The landing index is determined by which slice contains this angle
        const actualLandedIndex = Math.floor(normalizedLandingAngle / sliceAngleDegrees);

        // --- End Calculation ---

        // Set the final index result
        setLandedIndex(actualLandedIndex);

        // Check for win condition
        const didWin = actualLandedIndex === winningIndex;

        // Call the external finish handler
        onFinish?.(actualLandedIndex, didWin);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Informational display */}
      <h1 className="text-lg font-semibold">
        Winning Target Index: <span className="text-green-600">{winningIndex}</span>
      </h1>
      <h1 className="text-lg font-semibold">
        Landed Index: <span className="text-blue-600">{landedIndex ?? 'None'}</span>
        {landedIndex !== null && (
            <span className={`ml-2 font-bold ${landedIndex === winningIndex ? 'text-green-600' : 'text-red-600'}`}>
                ({landedIndex === winningIndex ? 'WIN!' : 'LOSE'})
            </span>
        )}
      </h1>

      <canvas
        ref={canvasRef}
        style={{ cursor: 'pointer', border: '2px solid #333', borderRadius: '50%' }}
        onClick={spin}
      />

      <button
        onClick={spin}
        disabled={spinning.current}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition duration-150 disabled:bg-gray-400"
      >
        {spinning.current ? 'SPINNING...' : 'SPIN THE WHEEL'}
      </button>
    </div>
  );
}