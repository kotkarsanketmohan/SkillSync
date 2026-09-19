import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-1.5 text-sm font-semibold tracking-wide text-text opacity-90">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-11 w-full rounded-lg border border-gray-300/80 bg-white/90 px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none input-glow-focus disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out hover:border-gray-400",
          error && "border-danger focus:ring-danger focus:border-danger input-glow-focus",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <span className="mt-1.5 text-xs font-medium text-danger animate-fade-in">{error}</span>
      )}
    </div>
  );
});

Input.displayName = "Input";
export { Input };
