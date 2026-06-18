import React from 'react';

type CheckCircleProps = {
  className?: string;
  size?: number;
};

const CheckCircle = ({ className = 'text-white', size = 24 }: CheckCircleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor" // This makes the inner part of the circle solid
      className={className}
    >
      {/* evenodd rule creates a hole exactly where the checkmark path sits 
        so it perfectly mirrors your reference image
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.59 7.41L11 14.17l-2.59-2.58L7 13l4 4 6-6-1.41-1.59z"
      />
    </svg>
  );
};

export default CheckCircle;