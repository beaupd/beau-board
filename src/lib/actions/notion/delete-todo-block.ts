"use server";

import { Notion } from "@/src/lib/clients/notion";

export const deleteTodoBlock = async ({ block_id }: { block_id: string }) => {
	const notion = new Notion();

	return await notion.deleteTodoBock({ block_id });
};
