import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, isLoading, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-teal text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
    secondary: "bg-gradient-to-r from-navy to-navy-light text-white hover:shadow-lg hover:shadow-navy/30 hover:-translate-y-0.5",
    outline: "border-2 border-gray-200 bg-transparent hover:border-primary hover:bg-primary/5 hover:text-primary text-text",
    ghost: "bg-transparent hover:bg-gray-100 text-text",
    danger: "bg-gradient-to-r from-danger to-red-600 text-white hover:shadow-lg hover:shadow-danger/30 hover:-translate-y-0.5",
  };

  const sizes = {
    default: "h-11 py-2 px-5",
    sm: "h-9 px-4 text-sm",
    lg: "h-14 px-8 text-lg",
    icon: "h-11 w-11",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button };
