"use server";

import type { UpdateBlockParameters } from "@notionhq/client";
import { Notion } from "@/src/lib/clients/notion";
import type { Block } from "../../interfaces/notion/block";

export const updateTodoBlock = async ({
	block_id,
	...rest
}: UpdateBlockParameters) => {
	const notion = new Notion();

	return await notion.updateTodoBlock({ block_id, ...rest });
};
