import React from 'react';

type UserIconProps = {
  className?: string;
  size?: number;
};

const UserIcon = ({ className = 'text-white', size = 24 }: UserIconProps) => {
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
      {/* Head */}
      <circle cx="12" cy="7" r="4" />
      {/* Shoulders */}
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    </svg>
  );
};

export default UserIcon;