import React from 'react';

type LightningIconProps = {
  className?: string;
  size?: number;
};

const LightningIcon = ({ className = 'text-white', size = 24 }: LightningIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Precision lightning path */}
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
};

export default LightningIcon;