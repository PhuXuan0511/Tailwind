import React from "react";
import { useNavigate } from "react-router-dom";

type BackButtonProps = {
  children?: React.ReactNode;
  to?: number | string; // Standard: -1 (eine Seite zurück)
  className?: string;
};

const BackButton: React.FC<BackButtonProps> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={mt-2 p-1 rounded text-blue-500 hover:text-blue-600 focus:outline-none}
    >
    <span className="text-blue">&#8592;</span>
    </button>
  );
};

export default BackButton;