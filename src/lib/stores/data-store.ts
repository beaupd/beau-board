"use client";

import { event, observable } from "@legendapp/state";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced, synced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";
import {
	differenceInCalendarDays,
	endOfYear,
	format,
	parseISO,
} from "date-fns";
import { createPushupEntry } from "../actions/notion/create-pushup-entry";
import { createTodo } from "../actions/notion/create-todo";
import { getPushupEntries } from "../actions/notion/get-pushup-entries";
import { getTodoColumns } from "../actions/notion/get-todo-columns";
import { getTodos } from "./../actions/notion/get-todos";
import { updateTodos } from "../actions/notion/update-todo";
import { createStore } from "../create-store";
import type { PushupPage } from "../interfaces/notion/pushup-page";
import type { TodoPage } from "../interfaces/notion/todo-page";
import { pollForStaleData } from "../utils/poll-for-stale-data";

// implement local storage with syncs
export const syncedStore = configureSynced(syncedCrud, {
	persist: {
		plugin: observablePersistIndexedDB({
			databaseName: "BeauBoardDB",
			version: 3,
			tableNames: [
				"lastUpdated",
				"todos",
				"pushups",
				"ideas",
				"todosContent",
			],
		}),
	},
});

const buildChangeFromPath = (path: string[], value: Object | string) => {
	if (path.length > 2)
		return buildChangeFromPath(path.slice(1), {
			[String(path[0])]: value,
		});
	return { [path[0]]: value };
};

// const POLL_DELAY_MS = 60000;

export const dataStore = () => {
	const poll$ = event();
	// setInterval(poll$.fire, POLL_DELAY_MS);

	const lastUpdatedRecord$ = observable(
		synced({
			initial: {} as Record<string, string>,
			persist: {
				plugin: observablePersistIndexedDB({
					databaseName: "BeauBoardDB",
					version: 2,
					tableNames: ["lastUpdated", "todos", "pushups", "ideas"],
				}),
				name: "lastUpdated",
			},
		}),
	);

	const todos$ = observable(
		syncedStore({
			list: () => getTodos(),
			create: (async ({ properties }: TodoPage<true>, paras: any) => {
				const res = await createTodo({ properties });
				paras.update({ value: res });
				paras.refresh();
				return res as TodoPage;
			}) as unknown as undefined,
			update: async (input, { changes }) => {
				if (input.id && input.properties) {
					return await updateTodos({
						page_id: input.id,
						...(buildChangeFromPath(
							changes[0].path.reverse(),
							changes[0].valueAtPath,
						) as any),
					});
				}

				return input;
			},
			// onSaved: ({ saved }) => {
			// 	return {
			// 		...saved,
			// 	};
			// },
			subscribe({ refresh, update }) {
				poll$.on(() =>
					pollForStaleData("todos", () =>
						lastUpdatedRecord$.todos.peek(),
					).then(({ isStale, lastUpdated }) => {
						if (isStale) {
							// refetch
							lastUpdatedRecord$.todos.set(lastUpdated);
							refresh();
						}
					}),
				);
			},
			persist: {
				name: "todos",
			},
			updatePartial: true,
		}),
	);

	const todoColumns$ = observable<
		TodoPage["properties"]["Status"]["status"][]
	>(() => getTodoColumns());

	const pushups$ = observable(
		syncedStore({
			list: () => getPushupEntries(),
			create: (async ({ properties }: PushupPage<true>, paras: any) => {
				const res = await createPushupEntry({ properties });
				paras.update({ value: res });
				paras.refresh();
				return res as PushupPage;
			}) as unknown as undefined,
			// onSaved: ({ saved }) => {
			// 	return {
			// 		...saved,
			// 	};
			// },
			subscribe({ refresh, update }) {
				poll$.on(() =>
					pollForStaleData("pushups", () =>
						lastUpdatedRecord$.todos.peek(),
					).then(({ isStale, lastUpdated }) => {
						if (isStale) {
							// refetch
							lastUpdatedRecord$.pushups.set(lastUpdated);
							refresh();
						}
					}),
				);
			},
			persist: {
				name: "pushups",
			},
			updatePartial: true,
		}),
	);

	const totalPushups$ = observable(() => {
		const pushups = pushups$.get();
		if (!pushups) return 0;

		return Object.entries(pushups).reduce(
			(sum, [_, obj]) => sum + obj.properties.Amount.number,
			0,
		);
	});

	const daysLeftInYear$ = observable(getDaysLeftInYear());

	function getDaysLeftInYear() {
		const today = new Date();
		return differenceInCalendarDays(endOfYear(today), today);
	}

	// 3. Automatically update every midnight
	function scheduleDailyUpdate() {
		const now = new Date();
		const msUntilMidnight =
			new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate() + 1,
				0,
				0,
				5,
			).getTime() - now.getTime();

		// Schedule next update
		setTimeout(() => {
			daysLeftInYear$.set(getDaysLeftInYear());
			scheduleDailyUpdate(); // reschedule for next day
		}, msUntilMidnight);
	}

	scheduleDailyUpdate();

	const averagePerDayNeeded$ = observable(() => {
		const daysLeft = daysLeftInYear$.get();
		const totalPushupsDone = totalPushups$.get();
		const totalPushupsLeft = 10000 - totalPushupsDone;

		return Number(totalPushupsLeft / daysLeft).toFixed(2);
	});

	const entriesGroupedByDay$ = observable<
		Record<string, PushupPage<false>[]>
	>(() => {
		const entriesById = pushups$.get();
		if (!entriesById) return {};

		return Object.entries(entriesById).reduce(
			(acc, [_, entry]) => {
				if (!entry.properties.Timestamp?.created_time) return acc;
				// Parse timestamp to a Date
				const date = parseISO(entry.properties.Timestamp!.created_time);

				// Format as YYYY-MM-DD
				const dayKey = format(date, "yyyy-MM-dd");

				// Initialize array if it doesn’t exist yet
				if (!acc[dayKey]) {
					acc[dayKey] = [];
				}

				// Push entry into that day’s bucket
				acc[dayKey].push(entry);

				return acc;
			},
			{} as Record<string, PushupPage<false>[]>,
		);
	});

	const today$ = observable(() => {
		daysLeftInYear$.get();
		return format(Date.now(), "yyyy-MM-dd");
	});

	return {
		todoColumns$,
		todos$,
		pushups$,
		totalPushups$,
		daysLeftInYear$,
		averagePerDayNeeded$,
		entriesGroupedByDay$,
		today$,
	};
};

export const [useDataStore, DataStoreProvider] = createStore(dataStore);
