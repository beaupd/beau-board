"use server";

import { Notion } from "@/src/lib/clients/notion";

export const getPushupEntries = async () => {
	const notion = new Notion();

	return await notion.getPushupEntries();
};
