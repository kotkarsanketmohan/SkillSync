import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from './Badges';

export const ProgressRing = ({ percentage, size = 120, strokeWidth = 10, colorClass = "text-primary", label, sublabel }) => {
  const [current, setCurrent] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  useEffect(() => {
    // Simple count up animation
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCurrent(percentage * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [percentage]);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={cn("transition-all duration-300 ease-out", colorClass)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold text-slate-800">
          {current.toFixed(1)}%
        </span>
        {label && <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{label}</span>}
      </div>
    </div>
  );
};

export const CountUp = ({ to, duration = 1.5, className }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = performance.now();
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(to * easeProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [to, duration]);

  return <span className={className}>{Math.round(count)}</span>;
};
