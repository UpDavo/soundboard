import type { ReactNode } from "react";
import { Panel } from "./Panel";

export function EmptyState({ children }: { children: ReactNode }) {
  return <Panel className="p-6 text-white/70">{children}</Panel>;
}
