"use client";

import { pickTipo, type Tipo } from "./tipo";

// Link a #sumate que además abre la pestaña del formulario que corresponde.
export function SumateLink({
  tipo,
  className,
  children,
}: {
  tipo: Tipo;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href="#sumate" className={className} onClick={() => pickTipo(tipo)}>
      {children}
    </a>
  );
}
