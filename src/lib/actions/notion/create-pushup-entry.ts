"use server";

import { Notion } from "@/src/lib/clients/notion";
import type { PushupPage } from "../../interfaces/notion/pushup-page";

export const createPushupEntry = async (data: PushupPage<true>) => {
	const notion = new Notion();

	return await notion.createPushupEntry(data);
};
