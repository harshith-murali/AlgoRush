"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiBlastProps {
  /** Set to true to trigger the confetti burst */
  active: boolean;
  /** Called after the animation finishes so the parent can reset the flag */
  onComplete?: () => void;
}

export function ConfettiBlast({ active, onComplete }: ConfettiBlastProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active || firedRef.current) return;
    firedRef.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    // AlgoRush brand colours: amber + zinc/white + emerald for success
    const colors = ["#f59e0b", "#fbbf24", "#10b981", "#ffffff", "#6366f1"];

    // Left-side cannon
    const fireLeft = () =>
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors,
        gravity: 0.9,
        scalar: 1.1,
        drift: 0.1,
      });

    // Right-side cannon
    const fireRight = () =>
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors,
        gravity: 0.9,
        scalar: 1.1,
        drift: -0.1,
      });

    // Centre top burst
    const fireCenter = () =>
      confetti({
        particleCount: 80,
        spread: 70,
        startVelocity: 40,
        origin: { x: 0.5, y: 0.3 },
        colors,
        gravity: 1.0,
        scalar: 0.95,
      });

    // Initial big burst
    fireLeft();
    fireRight();
    fireCenter();

    // Continuous trickle until duration ends
    const frame = () => {
      if (Date.now() < end) {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 50,
          origin: { x: 0, y: 0.65 },
          colors,
          gravity: 0.85,
          scalar: 0.85,
        });
        confetti({
          particleCount: 6,
          angle: 120,
          spread: 50,
          origin: { x: 1, y: 0.65 },
          colors,
          gravity: 0.85,
          scalar: 0.85,
        });
        requestAnimationFrame(frame);
      } else {
        firedRef.current = false;
        onComplete?.();
      }
    };

    requestAnimationFrame(frame);
  }, [active, onComplete]);

  return null;
}
