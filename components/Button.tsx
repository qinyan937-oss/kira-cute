
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-black transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:pointer-events-none rounded-2xl border-b-4 select-none";
  
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-lg"
  };

  const variants = {
    primary: "bg-pink-400 text-white border-pink-600 hover:bg-pink-500 shadow-pink-200",
    secondary: "bg-blue-400 text-white border-blue-600 hover:bg-blue-500 shadow-blue-200",
    outline: "bg-white text-slate-500 border-slate-200 hover:border-pink-300 hover:text-pink-500",
    ghost: "bg-transparent border-transparent border-b-0 text-slate-400 hover:text-pink-500 hover:bg-pink-50",
    danger: "bg-rose-500 text-white border-rose-700 hover:bg-rose-600 shadow-rose-200"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
