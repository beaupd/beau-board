"use client";

import { event, observable } from "@legendapp/state";
import { observablePersistIndexedDB } from "@legendapp/state/persist-plugins/indexeddb";
import { configureSynced, synced } from "@legendapp/state/sync";
import { syncedCrud } from "@legendapp/state/sync-plugins/crud";

import { getTodoColumns } from "../actions/notion/get-todo-columns";
import { getTodos } from "./../actions/notion/get-todos";
import { updateTodos } from "../actions/notion/update-todo";
import { createStore } from "../create-store";
import type { TodoPage } from "../interfaces/notion/todo-page";
import { pollForStaleData } from "../utils/poll-for-stale-data";

// implement local storage with syncs
const syncedStore = configureSynced(syncedCrud, {
	persist: {
		plugin: observablePersistIndexedDB({
			databaseName: "BeauBoardDB",
			version: 2,
			tableNames: ["lastUpdated", "todos", "pushups", "ideas"],
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

const POLL_DELAY_MS = 60000;

export const dataStore = () => {
	const poll$ = event();
	setInterval(poll$.fire, POLL_DELAY_MS);

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
			subscribe({ refresh }) {
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
		}),
	);

	const todoColumns$ = observable<
		TodoPage["properties"]["Status"]["status"][]
	>(() => getTodoColumns());

	return { todoColumns$, todos$ };
};

export const [useDataStore, DataStoreProvider] = createStore(dataStore);
