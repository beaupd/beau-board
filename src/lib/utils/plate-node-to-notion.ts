import type { BlockObjectRequest } from "@notionhq/client";
import type { TElement } from "platejs";

// Helper for turning text into Notion's rich_text type
function plainTextToRichText(text: string = "") {
	return [
		{
			type: "text",
			text: { content: text },
			plain_text: text,
			// Additional fields could be added as needed
		},
	];
}

export const plateNodeToNotion = (node: TElement): BlockObjectRequest => {
	switch (node.type) {
		case "paragraph":
			return {
				type: "paragraph",
				paragraph: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "heading1":
		case "heading_1":
			return {
				type: "heading_1",
				heading_1: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "heading2":
		case "heading_2":
			return {
				type: "heading_2",
				heading_2: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "heading3":
		case "heading_3":
			return {
				type: "heading_3",
				heading_3: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "list_item":
			// For this example, we will default to bulleted_list_item
			return {
				type: "bulleted_list_item",
				bulleted_list_item: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "quote":
			return {
				type: "quote",
				quote: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
		case "code_block":
			return {
				type: "code",
				code: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
					language: "plain text",
				},
			} as BlockObjectRequest;
		case "divider":
			return {
				type: "divider",
				divider: {},
			} as BlockObjectRequest;
		// Can add others like image, toggle, etc. if your Plate schema supports them
		default:
			// Fallback to paragraph for unsupported types
			return {
				type: "paragraph",
				paragraph: {
					rich_text: plainTextToRichText(
						node.children?.[0]?.text as string,
					),
				},
			} as BlockObjectRequest;
	}
};
