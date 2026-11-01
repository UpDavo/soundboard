"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";
import type { SoundboardState } from "./soundboard.slice";

interface StoreProviderProps {
  initialState: Partial<SoundboardState>;
  children: ReactNode;
}

export function StoreProvider({ initialState, children }: StoreProviderProps) {
  // Se crea una sola vez por montaje; el estado inicial viene del servidor (archivo txt).
  const [store] = useState(() => makeStore(initialState));
  return <Provider store={store}>{children}</Provider>;
}
