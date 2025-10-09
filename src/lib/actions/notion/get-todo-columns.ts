"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getTodoColumns = async () => {
	const notion = new Notion();

	return await notion.getTodoColumns();
};
