"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getTodo = async (todo_id: string) => {
	const notion = new Notion();

	return await notion.getTodo(todo_id);
};
