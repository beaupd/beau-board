"use server";

import type { BlockObjectRequest } from "@notionhq/client";
import { Notion } from "@/src/lib/clients/notion";

export const appendBlockChildren = async ({
	block_id,
	children,
}: {
	block_id: string;
	children: Array<BlockObjectRequest>;
}) => {
	const notion = new Notion();

	return await notion.appendBlockChildren({ block_id, children });
};
