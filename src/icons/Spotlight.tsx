import React from "react";

type SpotlightProps = {
  className?: string;
  size?: number;
};

const Spotlight = ({ className = "text-white", size = 24 }: SpotlightProps) => {
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
      <polygon points="12 3 22 21 2 21" />
    </svg>
  );
};

export default Spotlight;
