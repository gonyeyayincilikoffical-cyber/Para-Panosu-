import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  onClick?: () => void;
  hoverGlow?: boolean;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  badge,
  action,
  onClick,
  hoverGlow = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-slate-900/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 overflow-hidden transition-all duration-300 ${
        hoverGlow
          ? 'hover:border-slate-700 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-0.5'
          : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Background Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/20 via-transparent to-amber-500/5 pointer-events-none opacity-50" />

      {/* Bento Header if Title provided */}
      {(title || subtitle || badge || action) && (
        <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-slate-800/60">
          <div>
            {title && (
              <div className="flex items-center gap-2 font-space font-bold text-slate-100 text-sm tracking-wide">
                {title}
                {badge}
              </div>
            )}
            {subtitle && (
              <p className="text-xs font-mono text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
