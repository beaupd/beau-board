import { ReactNode, createContext, useContext, useRef, type JSX } from "react";

export const createStore = <
  T extends (initial: any) => any,
  U extends Parameters<T>[0]
>(
  store: T
): [
  () => NonNullable<ReturnType<T>>,
  ({ children, initial }: { children: ReactNode; initial: U }) => JSX.Element
] => {
  type GenericStore = ReturnType<typeof store>;

  const GenericStoreContext = createContext<GenericStore>(null!);

  const useGenericStore = () => {
    const context = useContext(GenericStoreContext);
    if (!context) throw Error(store.name + " is not injected into context");
    return context;
  };

  const createGenericStore = (initial: U) => {
    const storeRef = useRef<GenericStore>(null);
    if (storeRef.current === null) {
      storeRef.current = store(initial);
    }
    const storeCurrent = storeRef.current;
    return storeCurrent;
  };

  const GenericStoreProvider = ({
    children,
    initial,
  }: {
    children: ReactNode;
    initial: U;
  }) => {
    const store = createGenericStore(initial);

    return (
      <GenericStoreContext.Provider value={store!}>
        {children}
      </GenericStoreContext.Provider>
    );
  };

  return [useGenericStore, GenericStoreProvider];
};
