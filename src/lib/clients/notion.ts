import {
	type BlockObjectRequest,
	Client,
	type UpdateBlockParameters,
} from "@notionhq/client";
import type { Block } from "../interfaces/notion/block";
import type { PushupPage } from "../interfaces/notion/pushup-page";
import type { TodoPage } from "../interfaces/notion/todo-page";

export const board_page_id = "2802bf908930808fb314d693f4a9d1b4";
export const todos_db_id = "2802bf90-8930-800e-9b54-000b408e3db4";
export const pushups_entries_db_id = "28d2bf90-8930-80b6-892d-000b4d67fbff";

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
	async getTodos({
		archived = false,
	}: {
		archived: boolean;
	}): Promise<TodoPage[]> {
		const response = await this.client.dataSources.query({
			data_source_id: todos_db_id,
			filter: {
				property: "Archived",
				formula: { checkbox: { equals: archived } },
			},
		});

		return response.results as TodoPage[];
	}

	async getTodo(todo_id: string): Promise<TodoPage> {
		const response = await this.client.pages.retrieve({
			page_id: todo_id,
		});

		return response as TodoPage;
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
			properties: {...properties as any, ...{Archived: {checkbox: false}}},
		});

		return response as TodoPage;
	}

	async createTodo(data: TodoPage<true>) {
		const response = await this.client.pages.create({
			...{...(data as any), ...{properties: {...data.properties, Archived:{checkbox: false}}}},
			parent: { data_source_id: todos_db_id },
		});

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

	async getTodoBlocks({ todo_id }: { todo_id: string }) {
		const response = await this.client.blocks.children.list({
			block_id: todo_id,
		});

		return response.results;
	}

	async updateTodoBlock({ block_id, ...rest }: UpdateBlockParameters) {
		const response = await this.client.blocks.update({
			block_id,
			...rest,
		});

		return response;
	}

	async appendBlockChildren({
		block_id,
		children,
	}: {
		block_id: string;
		children: Array<BlockObjectRequest>;
	}) {
		const response = await this.client.blocks.children.append({
			block_id,
			children,
		});

		return response;
	}

	async deleteTodoBock({ block_id }: { block_id: string }) {
		const response = await this.client.blocks.delete({ block_id });

		return response;
	}

	async getPushupEntries(): Promise<PushupPage[]> {
		const response = await this.client.dataSources.query({
			data_source_id: pushups_entries_db_id,
		});

		return response.results as PushupPage[];
	}

	async createPushupEntry(data: PushupPage<true>) {
		const response = await this.client.pages.create({
			...(data as any),
			parent: { data_source_id: pushups_entries_db_id },
		});

		return response as PushupPage;
	}
}
