import type { PushupPage } from "@/src/lib/interfaces/notion/pushup-page";

export function totalPushupsByEntries(entries: PushupPage[]): number {
	return (
		entries?.reduce((sum, entry) => {
			const amount = entry?.properties?.Amount?.number ?? 0;
			return sum + amount;
		}, 0) ?? 0
	);
}
