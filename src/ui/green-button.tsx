import * as React from 'react';
import { ReactSVG } from 'react-svg';
import { cn } from '@/lib/utils';

interface GreenButtonProps {
  children: React.ReactNode;
  icon?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const GreenButton: React.FC<GreenButtonProps> = ({ children, icon, onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center content-center gap-2 px-4 py-2 text-sm font-medium text-[13px] text-white border-2 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        'border-[#86CE50] focus:border-[#86CE50] focus:outline-none  bg-gradient-to-b h-[32px] from-[#22313A] to-[#100E15] hover:opacity-90',
        className
      )}
    >
      <span>{children}</span>
      {icon && <ReactSVG src={icon} className='w-4 h-4 content-center' />}
    </button>
  );
};
