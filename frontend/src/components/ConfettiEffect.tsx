'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  x: number;
  y: number;
  colors?: string[];
  particleCount?: number;
  spread?: number;
  duration?: number;
}

export function triggerConfetti({
  x,
  y,
  colors = ['#4ade80', '#22d3ee', '#fbbf24', '#f87171', '#a78bfa'],
  particleCount = 50,
  spread = 70,
  duration = 1000,
}: ConfettiEffectProps) {
  const end = Date.now() + duration;

  const fire = () => {
    confetti({
      particleCount,
      spread,
      origin: { x, y },
      colors,
      ticks: 100,
      gravity: 1.2,
      decay: 0.94,
      startVelocity: 30,
      scalar: 1.2,
    });

    if (Date.now() < end) {
      requestAnimationFrame(fire);
    }
  };

  fire();
}

export function triggerWinConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#4ade80', '#22d3ee', '#fbbf24', '#f87171', '#a78bfa', '#fb923c'];

  const frame = () => {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });

    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}

export function triggerPerfectGameConfetti() {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = { 
    startVelocity: 30, 
    spread: 360, 
    ticks: 60, 
    zIndex: 0,
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB']
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

export function triggerStreakConfetti(streak: number) {
  const colors = streak >= 5 
    ? ['#FFD700', '#FFA500', '#FF4500'] // Gold/orange for high streaks
    : ['#4ade80', '#22d3ee', '#fbbf24']; // Regular colors

  confetti({
    particleCount: streak * 10,
    spread: 60,
    origin: { y: 0.4 },
    colors,
    ticks: 80,
    gravity: 1,
    decay: 0.95,
    startVelocity: 25,
  });
}
