"use client";
import React, { useRef, useEffect, useState } from "react";

interface WheelSpinnerProps {
  range: number;                 // number of slices (2..100)
  itemsName: string[];           // labels, length should be === range
  winner?: number;               // 0-based index of preselected winner (optional)
  size?: number;                 // diameter in px
  spins?: number;                // how many full spins before landing
  duration?: number;             // ms for spin animation
  onFinish?: (index: number, name: string) => void;
}

export default function WheelSpinner({
  range,
  itemsName,
  winner,
  size = 350,
  spins = 6,
  duration = 4200,
  onFinish,
}: WheelSpinnerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [angle, setAngle] = useState(0); // radians
  const spinning = useRef(false);

  // safety
  const slices = Math.max(2, Math.min(100, range));
  const labels = itemsName.slice(0, slices).concat(
    Array(Math.max(0, slices - itemsName.length)).fill("")
  );
  const sliceAngle = (2 * Math.PI) / slices; // radians per slice

  // draw wheel & needle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = size;
    const h = size;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale for DPR
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2;

    // draw rotating wheel
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle); // rotate the wheel by current angle (radians)

    // slices
    for (let i = 0; i < slices; i++) {
      const start = i * sliceAngle;
      const end = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r - 2, start, end, false);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#f9a825" : "#ffecb3";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // label
      ctx.save();
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.font = `${Math.max(10, Math.floor(r * 0.09))}px Arial`;
      ctx.fillStyle = "#111";
      const text = labels[i] || `#${i + 1}`;
      // clamp text length visually
      const maxWidth = r * 0.6;
      let displayText = text;
      // simple truncate
      while (ctx.measureText(displayText).width > maxWidth && displayText.length > 1) {
        displayText = displayText.slice(0, -1);
      }
      ctx.fillText(displayText, r - 12, 6);
      ctx.restore();
    }
    ctx.restore();

    // draw center hub
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(12, r * 0.08), 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#999";
    ctx.stroke();

    // draw needle (top, not rotating)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    const needleLength = r;
    ctx.moveTo(0, -needleLength + 6);
    ctx.lineTo(14, -needleLength + 46);
    ctx.lineTo(-14, -needleLength + 46);
    ctx.closePath();
    ctx.fillStyle = "#E53935";
    ctx.fill();
    ctx.restore();

    // optional pointer circle
    ctx.beginPath();
    ctx.arc(cx, cy - needleLength + 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#b71c1c";
    ctx.stroke();
  }, [angle, size, slices, labels, sliceAngle]);

  // compute final target radians so that selected slice center ends at top (-PI/2)
  const computeTargetRadiansForIndex = (index: number) => {
    // center angle of the slice in wheel coordinates (radians)
    const centerAngle = index * sliceAngle + sliceAngle / 2;
    // we want: (centerAngle + rotation) === -PI/2 (top)
    // rotation = -PI/2 - centerAngle + spins * 2PI (spins positive)
    const rotation = -Math.PI / 2 - centerAngle + spins * 2 * Math.PI;
    return rotation;
  };

  const spin = (controlledIndex?: number) => {
    if (spinning.current) return;
    spinning.current = true;

    const idx =
      controlledIndex !== undefined
        ? controlledIndex
        : winner !== undefined
        ? winner
        : Math.floor(Math.random() * slices);

    // validate idx
    const chosenIndex = Math.max(0, Math.min(slices - 1, idx));

    const startTime = performance.now();
    const startAngle = angle % (Math.PI * 2); // current
    const targetAngle = computeTargetRadiansForIndex(chosenIndex);
    // We want to animate from startAngle to targetAngle but keep the added spins.
    // Because computeTargetRadiansForIndex already includes spins*2PI, ensure continuity by offsetting spins so target > start
    let finalTarget = targetAngle;
    // If finalTarget <= startAngle, add 2π until it's larger for forward spin
    while (finalTarget <= startAngle) finalTarget += 2 * Math.PI;

    const durationMs = Math.max(300, duration);

    const step = (t: number) => {
      const elapsed = t - startTime;
      const p = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - p, 3);
      const current = startAngle + (finalTarget - startAngle) * ease;
      setAngle(current);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        spinning.current = false;
        // normalize index and call onFinish
        onFinish?.(chosenIndex, labels[chosenIndex] || `#${chosenIndex + 1}`);
      }
    };

    rafRef.current = requestAnimationFrame(step);
  };

  // cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        onClick={() => spin(undefined)}
        style={{ cursor: "pointer", touchAction: "none" }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => spin(undefined)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Spin (random)
        </button>
        <button
          onClick={() =>
            spin(winner !== undefined ? Math.max(0, Math.min(slices - 1, winner)) : 0)
          }
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Spin (controlled)
        </button>
      </div>
    </div>
  );
}
