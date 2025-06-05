import { toast } from "react-toastify";

/**
 * Displays a toast notification if a specific key in localStorage is set to "true".
 * @param key - The localStorage key to check.
 * @param message - The message to display in the toast.
 * @param options - Optional toast configuration overrides.
 */
export const showToastFromLocalStorage = (key: string, message: string, options = {}) => {
  if (localStorage.getItem(key) === "true") {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      ...options, // Allow overriding default options
    });
    localStorage.removeItem(key); // Clear the flag
  }
};
export const showErrorToastFromLocalStorage = (key: string, message: string, options = {}) => {
  if (localStorage.getItem(key) === "true") {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      ...options,
    });
    localStorage.removeItem(key);
  }
};
