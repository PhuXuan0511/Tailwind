import React from "react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const BackButton: React.FC<BackButtonProps> = ({ onClick, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      className="mt-2 p-1 rounded text-blue-400 hover:text-blue-500 focus:outline-none"
      onClick={handleClick}
      {...props}
    >
      <span className="text-blue-400 hover:text-blue-500">&#8617;</span>
    </button>
  );
};

export default BackButton;