"use server";

import { Notion } from "@/src/lib/clients/notion";
import type { TodoPage } from "../../interfaces/notion/todo-page";

export const createTodo = async (data: TodoPage<true>) => {
	const notion = new Notion();

	return await notion.createTodo(data);
};
