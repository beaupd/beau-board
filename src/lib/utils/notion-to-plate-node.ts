import type {
	BlockObjectResponse,
	UnsupportedBlockObjectResponse,
} from "@notionhq/client";

export const notionToPlateNode = (
	block: Exclude<BlockObjectResponse, UnsupportedBlockObjectResponse>,
) => {
	switch (block.type) {
		case "paragraph":
			return {
				id: block.id,
				type: "paragraph",
				children: [
					{ text: block.paragraph?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "heading_1":
			return {
				id: block.id,
				type: "heading1",
				children: [
					{ text: block.heading_1?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "heading_2":
			return {
				id: block.id,
				type: "heading2",
				children: [
					{ text: block.heading_2?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "heading_3":
			return {
				id: block.id,
				type: "heading3",
				children: [
					{ text: block.heading_3?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "bulleted_list_item":
		case "numbered_list_item":
			return {
				id: block.id,
				type: "list_item",
				children: [{ text: "" }],
			};
		case "quote":
			return {
				id: block.id,
				type: "quote",
				children: [
					{ text: block.quote?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "code":
			return {
				id: block.id,
				type: "code_block",
				children: [
					{ text: block.code?.rich_text?.[0]?.plain_text ?? "" },
				],
			};
		case "divider":
			return { id: block.id, type: "divider", children: [{ text: "" }] };
		default:
			return {
				id: block.id,
				type: "paragraph",
				children: [{ text: "" }],
			};
	}
};
