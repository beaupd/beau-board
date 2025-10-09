"use client";

import { observable } from "@legendapp/state";
import { createStore } from "../create-store";

export const uiStore = () => {
  const autoplay$ = observable(false);
  const currentStep$ = observable(1);

  const openTodoCreate$ = observable<{
    isOpen: boolean;
    column: null | string;
  }>({ isOpen: false, column: null });

  return { autoplay$, currentStep$, openTodoCreate$ };
};

export const [useUIStore, UIStoreProvider] = createStore(uiStore);
