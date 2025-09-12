import React from "react";

export type DietaryProps = { type: "vegetarian" | "vegan" | "other"; description: string };

export function Dietary({ type, description }: DietaryProps) {
  const label = type === "vegetarian" ? "Vegetarian" : type === "vegan" ? "Vegan" : "Dietary";
  return (
    <div className="p-4 bg-gray-50 rounded-lg">    
        <div className="space-y-2">
        <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>🌿</span>
            <span className="font-medium text-gray-800">{label}</span>
        </div>
        <p className="text-gray-700">{description}</p>
        </div>
    </div>
  );
}


