"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getBoardChildren = async () => {
	const notion = new Notion();

	return await notion.getBoardBlocks();
};
