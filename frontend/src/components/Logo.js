import React from 'react';

const Logo = ({ size = 'default', variant = 'full' }) => {
  const sizes = {
    sm: { icon: 'text-2xl', text: 'text-lg' },
    default: { icon: 'text-3xl', text: 'text-xl' },
    lg: { icon: 'text-4xl', text: 'text-2xl' },
    xl: { icon: 'text-5xl', text: 'text-3xl' }
  };

  const currentSize = sizes[size] || sizes.default;

  if (variant === 'icon') {
    return (
      <div className={`${currentSize.icon} animate-pulse-soft`}>
        🏠
      </div>
    );
  }

  return (
    <div className="flex items-center group">
      <div className={`${currentSize.icon} animate-pulse-soft group-hover:animate-bounce transition-all duration-300`}>
        🏠
      </div>
      <div className="ml-3">
        <div className={`${currentSize.text} font-display font-bold gradient-text-professional leading-none`}>
          SmartNyumba
        </div>
        <div className="text-xs text-neutral-500 font-medium tracking-wide uppercase">
          Kenya Property Platform
        </div>
      </div>
    </div>
  );
};

export default Logo;
