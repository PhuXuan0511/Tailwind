import React from "react";
import { Outlet } from "react-router-dom";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="p-4 flex text-white items-center justify-between bg-gray-800">
        <p className="text-3xl">
          Tools<span className="text-purple-500"> FussSpring</span>
        </p>
      </nav>
      <main>{children || <Outlet />}</main>
    </div>
  );
}
