import {
	createContext,
	type JSX,
	type ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

type Nullify<T> = {
	[K in keyof T]: null;
};

export const createStore = <
	T extends (initial: any) => any,
	U extends Parameters<T>[0],
>(
	store: T,
): [
	() => NonNullable<ReturnType<T> | Nullify<ReturnType<T>>>,
	({ children, initial }: { children: ReactNode; initial: U }) => JSX.Element,
] => {
	type GenericStore = ReturnType<typeof store>;

	const GenericStoreContext = createContext<
		GenericStore | Nullify<GenericStore>
	>(null!);

	const useGenericStore = () => {
		const context = useContext(GenericStoreContext);
		if (!context) throw Error(store.name + " is not injected into context");
		return context;
	};

	// const createGenericStore = (initial: U) => {
	// 	const storeRef = useRef<GenericStore>(null);
	// 	if (storeRef.current === null) {
	// 		storeRef.current = store(initial);
	// 	}
	// 	const storeCurrent = storeRef.current;
	// 	return storeCurrent;
	// };

	const GenericStoreProvider = ({
		children,
		initial,
	}: {
		children: ReactNode;
		initial: U;
	}) => {
		// const store = createGenericStore(initial);
		const [_store, setStore] = useState<
			GenericStore | Nullify<GenericStore>
		>(
			new Proxy(
				{},
				{
					get(target, props) {
						return null;
					},
				},
			) as Nullify<GenericStore> | GenericStore,
		);

		useEffect(() => {
			setStore(store(initial));
		}, [initial, store]);

		return (
			<GenericStoreContext.Provider value={_store}>
				{children}
			</GenericStoreContext.Provider>
		);
	};

	return [useGenericStore, GenericStoreProvider];
};
