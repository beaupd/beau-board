"use client";

import { observable } from "@legendapp/state";
import { getTodos } from "../actions/notion/get-todos";
import { createStore } from "../create-store";
import type { TodoPage } from "../interfaces/notion/todo-page";

// implement local storage with syncs

export const dataStore = ({}) => {
	const todos$ = observable<TodoPage[] | undefined>(() => getTodos());

	return { todos$ };
};

export const [useDataStore, DataStoreProvider] = createStore(dataStore);
