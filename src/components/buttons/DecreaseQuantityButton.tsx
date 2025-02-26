"use client";

import React from "react";

interface DecreaseQuantityButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const DecreaseQuantityButton: React.FC<DecreaseQuantityButtonProps> = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1 bg-gray-200 text-black rounded-lg disabled:opacity-50"
    >
      -
    </button>
  );
};

export default DecreaseQuantityButton;
