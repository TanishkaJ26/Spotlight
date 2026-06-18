import React from 'react';

type HomeIconProps = {
  className?: string;
  size?: number;
};

const HomeIcon = ({ className = 'text-white', size = 24 }: HomeIconProps) => {
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
      {/* Outer House Structure */}
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      {/* Inner Rounded Doorway */}
      <path d="M9 22V14a3 3 0 0 1 6 0v8" />
    </svg>
  );
};

export default HomeIcon;