import React from 'react';
import './vandalhub-logo.css';

const VandalHubLogo = ({ 
  size = 32, 
  className = '', 
  showText = true, 
  variant = 'default' // 'default', 'minimal', 'icon-only'
}) => {
  const logoId = `vandal-logo-${Math.random().toString(36).substr(2, 9)}`;
  
  const LogoSVG = () => (
    <svg 
      height={size} 
      viewBox="0 0 32 32" 
      width={size} 
      className={`vandalhub-logo ${className}`}
    >
      <defs>
        <linearGradient id={logoId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#58a6ff', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#3fb950', stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      {/* Main V Shape */}
      <path 
        d="M16 4 L8 18 L12 18 L16 10 L20 18 L24 18 L16 4 Z" 
        fill={`url(#${logoId})`}
      />
      
      {/* Code brackets - only show in default variant */}
      {variant === 'default' && (
        <path 
          d="M4 8 L2 10 L2 18 L4 20 M28 8 L30 10 L30 18 L28 20" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round"
        />
      )}
      
      {/* Hub dots - only show in default and minimal variants */}
      {variant !== 'icon-only' && (
        <>
          <circle cx="6" cy="24" r="2" fill="currentColor" opacity="0.7"/>
          <circle cx="16" cy="26" r="2" fill="currentColor"/>
          <circle cx="26" cy="24" r="2" fill="currentColor" opacity="0.7"/>
          
          {/* Connection line */}
          <path 
            d="M6 24 L16 26 L26 24" 
            stroke="currentColor" 
            strokeWidth="1" 
            fill="none" 
            opacity="0.5"
          />
        </>
      )}
    </svg>
  );

  if (!showText) {
    return <LogoSVG />;
  }

  return (
    <div className={`vandalhub-brand ${className}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <LogoSVG />
      <span className="brand-text" style={{ 
        fontSize: `${size * 0.5}px`, 
        fontWeight: '600',
        color: 'currentColor'
      }}>
        VandalHub
      </span>
    </div>
  );
};

export default VandalHubLogo;
