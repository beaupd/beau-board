import type { Observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";

export function useObservable<T>($: Observable<T> | null, defaultValue: T): [T];
export function useObservable<T>($: Observable<T> | null): [T | null];
export function useObservable<T>(
	$: Observable<T> | null,
	defaultValue?: T,
): [T | null] {
	const value = use$<T>(() => $?.get());

	if (defaultValue && !value) {
		return [defaultValue];
	}

	return [value];
}
