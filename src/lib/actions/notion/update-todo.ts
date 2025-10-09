"use server";

import { Notion } from "@/src/lib/clients/notion";

export const updateTodos = async (
  data: Parameters<Notion["updateTodo"]>[0]
) => {
  const notion = new Notion();

  return await notion.updateTodo(data);
};
