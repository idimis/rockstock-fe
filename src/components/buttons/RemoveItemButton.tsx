"use client";

import React from "react";

interface RemoveItemButtonProps {
  onClick: () => void;
}

const RemoveItemButton: React.FC<RemoveItemButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="ml-4 text-red-500 hover:text-red-700">
      Remove
    </button>
  );
};

export default RemoveItemButton;
