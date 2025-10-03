"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getTodos = async () => {
	const notion = new Notion();

	return await notion.getTodos();
};
