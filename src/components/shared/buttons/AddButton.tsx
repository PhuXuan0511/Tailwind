import React from "react";

type AddButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AddButton: React.FC<AddButtonProps> = ({...props }) => (
    <button
        type="button"
        className="mt-2 p-1 rounded text-green-500 hover:text-green-600 focus:outline-none"
        {...props}
    >
        <span className="font-bold text-green-500 hover:text-green-600">Add</span>
    </button>
);

export default AddButton;