'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    
    const baseStyles = 'inline-flex items-center justify-center rounded-full font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-md hover:shadow-lg hover:from-primary-dark hover:to-primary focus:ring-primary',
      secondary: 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-md hover:shadow-lg hover:from-secondary-dark hover:to-secondary focus:ring-secondary',
      accent: 'bg-gradient-to-r from-accent to-accent-dark text-white shadow-md hover:shadow-lg hover:from-accent-dark hover:to-accent focus:ring-accent',
      outline: 'border-2 border-primary text-primary hover:bg-pink-50 focus:ring-primary',
      ghost: 'text-gray-600 hover:bg-pink-100 hover:text-primary focus:ring-primary',
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
