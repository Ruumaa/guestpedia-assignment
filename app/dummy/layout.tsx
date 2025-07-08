import React from 'react';

export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-white">{children}</section>;
}
