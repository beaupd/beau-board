import type { Observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";

export const useObservable = <T,>(
	$: Observable<T>,
): [T, (v: T | ((u: T) => T)) => void] => {
	const value = use$<T>(() => $.get());

	return [value, ($ as any).set];
};
