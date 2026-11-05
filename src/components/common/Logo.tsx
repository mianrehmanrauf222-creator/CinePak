import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = true, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const sloganSizes = {
    sm: 'text-[9px] tracking-[0.2em]',
    md: 'text-[10px] tracking-[0.25em]',
    lg: 'text-xs tracking-[0.3em]',
    xl: 'text-sm tracking-[0.35em]'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Cinematic Golden Reel Monogram */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-[1.5px] shadow-[0_0_15px_rgba(245,158,11,0.35)]">
          <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-[#16161c] to-[#090a0d] flex items-center justify-center overflow-hidden">
            {/* Film strip decorative bars */}
            <div className="absolute top-0.5 inset-x-1 flex justify-between px-0.5 opacity-60">
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            </div>
            
            {/* Elegant Monogram 'C' with play triangle */}
            <div className="relative flex items-center justify-center">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-600 font-serif leading-none text-xl sm:text-2xl">
                C
              </span>
              <span className="absolute -right-1.5 w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-yellow-400 filter drop-shadow"></span>
            </div>

            <div className="absolute bottom-0.5 inset-x-1 flex justify-between px-0.5 opacity-60">
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Name & Slogan */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className={`font-black tracking-wider uppercase font-['Cinzel',serif] ${titleSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 drop-shadow-sm`}>
            CINE
          </span>
          <span className={`font-black tracking-wider uppercase font-['Cinzel',serif] ${titleSizes[size]} text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]`}>
            PAK
          </span>
        </div>
        {showSlogan && (
          <span className={`text-neutral-400 font-medium uppercase font-sans mt-0.5 ${sloganSizes[size]}`}>
            Your World of Movies
          </span>
        )}
      </div>
    </div>
  );
};
