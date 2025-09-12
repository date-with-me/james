import React from "react";

export type StatProps = {
  label: string;
  value: string;
  emoji?: string;
};

export function Stat({ label, value, emoji }: StatProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="text-xl" aria-hidden>{emoji ?? ""}</div>
      <div>
        <div className="text-sm uppercase tracking-wide text-gray-500">{label}</div>
        <div className="text-base md:text-lg font-medium text-gray-800">{value}</div>
      </div>
    </div>
  );
}


