import React from "react";

type DeleteButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const DeleteButton: React.FC<DeleteButtonProps> = ({...props }) => (
    <button
        type="button"
        className="mt-2 p-1 rounded text-red-500 hover:text-red-600 focus:outline-none"
        {...props}
    >
        <span className="text-red-500 hover:text-red-600">&#10006;</span>
    </button>
);

export default DeleteButton;