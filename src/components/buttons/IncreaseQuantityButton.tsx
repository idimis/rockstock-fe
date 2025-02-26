"use client";

import React from "react";

interface IncreaseQuantityButtonProps {
  onClick: () => void;
}

const IncreaseQuantityButton: React.FC<IncreaseQuantityButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="px-3 py-1 bg-gray-200 text-black rounded-lg">
      +
    </button>
  );
};

export default IncreaseQuantityButton;
