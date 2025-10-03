"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getBoard = async () => {
	const notion = new Notion();

	return await notion.getBoard();
};
