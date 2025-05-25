import React, { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  isLoading = false,
  variant = 'primary',
  size = 'md',
  icon
}) => {
  const baseClasses = "rounded-md transition-colors flex items-center justify-center space-x-2";

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-300",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white disabled:bg-gray-300",
    outline: "bg-transparent border border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white disabled:text-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      <span>{children}</span>
    </button>
  );
};