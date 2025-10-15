import type {
	BlockObjectResponse,
	UnsupportedBlockObjectResponse,
} from "@notionhq/client";
import type { TElement } from "platejs";
import { notionToPlateNode } from "../../utils/notion-to-plate-node";
import { plateNodeToNotion } from "../../utils/plate-node-to-notion";

export type NotionBlock =
	| { type: "paragraph"; text: string; children?: NotionBlock[] }
	| {
			type: "heading_1" | "heading_2" | "heading_3";
			text: string;
			children?: NotionBlock[];
	  }
	| {
			type: "bulleted_list_item" | "numbered_list_item";
			text: string;
			children?: NotionBlock[];
	  }
	| { type: "toggle"; text: string; children: NotionBlock[] }
	| { type: "image"; url: string; caption?: string }
	| { type: "quote"; text: string; children?: NotionBlock[] };

// transform to class
export class Block {
	type: BlockObjectResponse["type"];
	id: string;
	object: string;
	created_time: string;
	last_edited_time: string;
	archived: boolean;
	has_children: boolean;
	[key: string]: any; // allow additional fields

	constructor(block: BlockObjectResponse) {
		this.type = block.type;
		this.id = block.id;
		this.object = block.object;
		this.created_time = block.created_time;
		this.last_edited_time = block.last_edited_time;
		this.archived = block.archived;
		this.has_children = block.has_children;

		// Copy type-specific properties
		Object.keys(block).forEach((key) => {
			if (
				![
					"type",
					"id",
					"object",
					"created_time",
					"last_edited_time",
					"archived",
					"has_children",
				].includes(key)
			) {
				this[key] = (block as any)[key];
			}
		});
	}

	toPlateNode(): TElement {
		return notionToPlateNode(
			this as unknown as Exclude<
				BlockObjectResponse,
				UnsupportedBlockObjectResponse
			>,
		);
	}
}
