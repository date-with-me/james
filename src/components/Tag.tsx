import React from "react";

export type TagProps = { children: React.ReactNode };

export function Tag({ children }: TagProps) {
  return (
    <span className="inline-block text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
      {children}
    </span>
  );
}


