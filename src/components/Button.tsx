import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center px-4 py-2 text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-black text-white hover:bg-gray-800 active:bg-gray-900',
    secondary:
      'bg-white text-black border border-black hover:bg-gray-50 active:bg-gray-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
