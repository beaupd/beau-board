"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getTodoblocks = async ({ todo_id }: { todo_id: string }) => {
	const notion = new Notion();

	return await notion.getTodoBlocks({ todo_id });
};
