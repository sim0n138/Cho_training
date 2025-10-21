import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 p-6 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-black hover:shadow-sm' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
