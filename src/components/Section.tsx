import React from "react";

export type SectionProps = {
  title: string;
  children: React.ReactNode;
  id?: string;
};

export function Section({ title, children, id }: SectionProps) {
  return (
    <section id={id} className="bg-white rounded-xl shadow-md p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        {title}
      </h2>
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </section>
  );
}


