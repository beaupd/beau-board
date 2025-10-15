"use client";

import { observable } from "@legendapp/state";
import type { BlockObjectRequest } from "@notionhq/client";
import { isEqual, isMatch } from "lodash";
import type { TElement, Value } from "platejs";
import { Plate, type TPlateEditor, usePlateEditor } from "platejs/react";
import type { ReactNode } from "react";
import { BasicNodesKit } from "@/src/components/editor/plugins/basic-nodes-kit";
import { appendBlockChildren } from "../actions/notion/append-block-children";
import { deleteTodoBlock } from "../actions/notion/delete-todo-block";
import { getTodoblocks } from "../actions/notion/get-todo-blocks";
import { updateTodoBlock } from "../actions/notion/update-todo-block";
import { createStore } from "../create-store";
import { Block } from "../interfaces/notion/block";
import type { TodoPage } from "../interfaces/notion/todo-page";
import { plateNodeToNotion } from "../utils/plate-node-to-notion";
import { syncedStore } from "./data-store";

export const todoStore = ({
	todo,
	editor,
}: {
	todo: TodoPage;
	editor: TPlateEditor;
}) => {
	const todo$ = observable(todo);

	const todoBlocks$ = observable(
		syncedStore({
			get: async () => {
				const blocks = await getTodoblocks({ todo_id: todo.id! });
				return {
					id: todo.id,
					blocks,
				};
			},
			update: async ({ blocks }, { changes }) => {
				const oldBlocks = changes[0].prevAtPath;
				const blocksById = Object.fromEntries(
					blocks?.map((b) => [b.id, b]) ?? [],
				);

				const newBlocksArray = Array.isArray(blocks)
					? blocks
					: Object.values(blocks || {});
				const oldBlocksArray = Array.isArray(oldBlocks)
					? oldBlocks
					: Object.values(oldBlocks || {});

				const getId = (b: any) => b?.id;

				const newIds = new Set(
					newBlocksArray.map(getId).filter(Boolean),
				);
				const oldIds = new Set(
					oldBlocksArray.map(getId).filter(Boolean),
				);

				// Blocks to remove: in old but not in new
				const remove = Array.from(oldIds).filter(
					(id) => !newIds.has(id),
				);

				// Blocks to add: in new but not in old
				const add = Array.from(newIds).filter((id) => !oldIds.has(id));

				// Blocks to update: in both, and value changed
				const needsupdate = newBlocksArray
					.filter((b) => {
						const id = getId(b);
						if (!id || !oldIds.has(id)) return false;
						const oldBlock = oldBlocksArray.find(
							(ob) => getId(ob) === id,
						);
						return oldBlock && !isMatch(b as any, oldBlock);
					})
					.map((b) => getId(b));

				await Promise.all([
					...needsupdate.map(async (block_id) => {
						if (!blocksById[block_id]) return;
						await updateTodoBlock({
							block_id,
							...blocksById[block_id],
						});
					}),
					await appendBlockChildren({
						block_id: todo.id!,
						children: add.map((block_id) => {
							const { id, ...block } = blocksById[block_id];
							return block;
						}) as BlockObjectRequest[],
					}),
					...remove.map(async (block_id) => {
						await deleteTodoBlock({ block_id });
					}),
				]);

				return { blocks };
			},
			persist: {
				name: "todosContent",
				indexedDB: {
					itemID: todo.id ?? "undefined",
				},
			},
		}),
	);

	const changing$ = observable(false);

	const initialNodes$ = observable<TElement[] | null>(() => {
		const blocks = todoBlocks$.blocks.get();

		if (!blocks) return null;
		const nodes = Object.entries(blocks).map(([_, b]) =>
			new Block(b as any).toPlateNode(),
		);

		return nodes;
	});

	initialNodes$.onChange(
		(nodes) => {
			editor.tf.init(nodes);
			changing$.set(false);
		},
		{ initial: true },
	);

	const editorOnChange = ({ value }: { value: Value }) => {
		const initialNodes = initialNodes$.peek();
		if (!initialNodes || !isMatch(value, initialNodes)) {
			changing$?.set(true);
		}
	};

	const discardChanges = () => {
		const initialNodes = initialNodes$.peek();
		editor.tf.init({ value: initialNodes });
		changing$.set(false);
	};

	const saveChanges = async () => {
		todoBlocks$.blocks.set(
			editor.children.map((c) => ({
				id: c.id,
				...plateNodeToNotion(c),
			})) as any,
		);
	};

	return {
		todo$,
		todoBlocks$,
		changing$,
		initialNodes$,
		editor,
		editorOnChange,
		discardChanges,
		saveChanges,
	};
};

const [useTodoStore, _TodoStoreProvider] = createStore(todoStore);

const PlateProviderWrapper = ({
	children,
	initial,
}: {
	children: ReactNode;
	initial: { editor: TPlateEditor };
}) => {
	const { editorOnChange } = useTodoStore();

	return (
		<Plate editor={initial.editor} onValueChange={editorOnChange}>
			{children}
		</Plate>
	);
};

const TodoStoreProvider = ({
	children,
	initial,
}: {
	children: ReactNode;
	initial: { todo: TodoPage };
}) => {
	const editor = usePlateEditor({
		plugins: BasicNodesKit,
	});

	return (
		<_TodoStoreProvider
			initial={{
				todo: initial.todo,
				editor: editor as unknown as TPlateEditor,
			}}
		>
			<PlateProviderWrapper
				initial={{ editor: editor as unknown as TPlateEditor }}
			>
				{children}
			</PlateProviderWrapper>
		</_TodoStoreProvider>
	);
};

export { useTodoStore, TodoStoreProvider };
