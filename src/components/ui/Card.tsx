import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlighted';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    
    const baseStyles = 'bg-white rounded-3xl p-6 transition-all duration-300';
    
    const variants = {
      default: 'shadow-md hover:shadow-xl hover:-translate-y-1 border border-pink-50',
      highlighted: 'shadow-lg hover:shadow-2xl hover:-translate-y-2 border-2 border-primary shadow-pink-200/50',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
