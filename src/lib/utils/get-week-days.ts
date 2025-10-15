import { addDays, endOfWeek, format, startOfWeek, subWeeks } from "date-fns";

/**
 * Get all days (as Date objects) for this, last, or next week.
 * @param which "this" | "last" | "next"
 */
export function getWeekDays(which: "this" | "last" | "next" = "this"): Date[] {
	const today = new Date();

	// Determine the start of the desired week (Monday)
	let start = startOfWeek(today, { weekStartsOn: 1 });
	if (which === "last") start = subWeeks(start, 1);
	if (which === "next") start = addDays(start, 7);

	const end = endOfWeek(start, { weekStartsOn: 1 });

	// Build an array of all 7 days
	const days: Date[] = [];
	for (let d = start; d <= end; d = addDays(d, 1)) {
		days.push(d);
	}

	return days;
}
