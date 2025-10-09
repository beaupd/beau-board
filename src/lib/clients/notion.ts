import { Client } from "@notionhq/client";
import type { TodoPage } from "../interfaces/notion/todo-page";

const board_page_id = "2802bf908930808fb314d693f4a9d1b4";
const todos_db_id = "2802bf90-8930-800e-9b54-000b408e3db4";

const { NOTION_TOKEN } = process.env;

export class Notion {
  client: Client;

  constructor() {
    if (!NOTION_TOKEN) throw Error("No notion token");
    this.client = new Client({
      auth: NOTION_TOKEN,
    });
  }

  async getBoard() {
    const response = await this.client.pages.retrieve({
      page_id: board_page_id,
    });

    return response;
  }

  async getBoardBlocks() {
    const response = await this.client.blocks.children.list({
      block_id: board_page_id,
    });

    return response;
  }

  // get todo database columns
  async getTodoColumns(): Promise<
    TodoPage["properties"]["Status"]["status"][]
  > {
    const response = await this.client.dataSources.retrieve({
      data_source_id: todos_db_id,
    });

    return (response?.properties?.Status as any)?.status?.options;
  }

  // get todos items
  async getTodos(): Promise<TodoPage[]> {
    const response = await this.client.dataSources.query({
      data_source_id: todos_db_id,
    });

    return response.results as TodoPage[];
  }

  async updateTodo({
    page_id,
    properties,
  }: {
    page_id: string;
    properties: Partial<TodoPage["properties"]>;
  }): Promise<TodoPage> {
    const response = await this.client.pages.update({
      page_id,
      properties: properties as any,
    });

    return response as TodoPage;
  }

  async createTodo(data: TodoPage) {
    const response = await this.client.pages.create(data as any);

    return response as TodoPage;
  }

  // async change page to column
  async moveTodoToColumn({
    page_id,
    status_id,
  }: {
    page_id: string;
    status_id: string;
  }) {
    const response = await this.client.pages.update({
      page_id,
      properties: { Status: { status: { id: status_id } } },
    });

    return response;
  }
}
