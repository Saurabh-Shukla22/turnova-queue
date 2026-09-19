import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const heights = {
    sm: 44,
    md: 52,
    lg: 68,
  };

  const h = heights[size];

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`}>
      <Image
        src="/turnova-logo.png"
        alt="Turnova – Your turn. Your time."
        width={h * 2.6}
        height={h}
        priority
        className="group-hover:scale-105 transition-transform object-contain"
        style={{ height: h, width: 'auto' }}
      />
    </Link>
  );
};
