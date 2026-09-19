import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

export function MatchScore({ score, size = 'md', className }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(score);
    if (start === end) return;
    if (isNaN(end)) return;
    
    // Quick count-up
    const duration = 1000;
    const steps = 30;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const increment = end / steps;
    
    let timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        clearInterval(timer);
        setDisplayScore(end);
      } else {
        setDisplayScore(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const sizes = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl"
  };

  const getScoreColor = (val) => {
    if (val >= 80) return "text-success";
    if (val >= 60) return "text-warning";
    return "text-danger";
  };

  return (
    <span className={cn("font-black tracking-tight", sizes[size], getScoreColor(displayScore), className)}>
      {displayScore.toFixed(1)}%
    </span>
  );
}
