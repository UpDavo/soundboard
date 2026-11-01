import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Contenido a la derecha (ej. tarjeta de volumen). */
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="pt-1">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-white/50">{subtitle}</p>}
      </div>
      {actions}
    </header>
  );
}
