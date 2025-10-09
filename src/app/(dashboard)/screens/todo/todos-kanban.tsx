"use client";

import { batch } from "@legendapp/state";
import { PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanHeader,
	KanbanProvider,
} from "@/src/components/ui/shadcn-io/kanban";
import { useObservable } from "@/src/hooks/useObservable";
import { useDataStore } from "@/src/lib/stores/data-store";
import { useUIStore } from "@/src/lib/stores/ui-store";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// const columns = [
// 	{ id: "aaa111", name: "Planned", color: "#6B7280" },
// 	{ id: "bbb222", name: "In Progress", color: "#F59E0B" },
// 	{ id: "ccc333", name: "Done", color: "#10B981" },
// ];

const exampleFeatures = [
	{
		id: "9292",
		name: "test",
		startAt: new Date(Date.now() - 2),
		endAt: new Date(Date.now()),
		column: "aaa111",
		owner: {},
	},
];

const dateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
});
const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
});

type KanbanTodo = {
	id: string;
	name: string;
	column: string;
};

const TodosKanban = () => {
	const { todos$, todoColumns$ } = useDataStore();
	const { openTodoCreate$ } = useUIStore();
	const [_todos] = useObservable(todos$);
	const [columns] = useObservable(todoColumns$);

	const todos = useMemo<KanbanTodo[]>(() => {
		if (!_todos) return [];
		return Object.entries(_todos).map(([_, todo]: any) => ({
			id: todo.id,
			name: todo.properties.Name.title[0].text.content,
			column: todo.properties.Status.status.id,
		}));
	}, [_todos]);

	const setTodos = (updatedChanged: KanbanTodo[]) => {
		batch(() => {
			for (const maybeChanged of updatedChanged) {
				todos$?.[maybeChanged.id].properties.Status.status.id.set(
					maybeChanged.column,
				);
			}
		});
	};

	return (
		<KanbanProvider
			columns={columns ?? []}
			data={todos ?? []}
			onDataChange={setTodos}
		>
			{(column) => (
				<KanbanBoard id={column.id} key={column.id}>
					<KanbanHeader>
						<div className="flex items-center gap-2">
							<div
								className="h-2 w-2 rounded-full"
								style={{ backgroundColor: column.color }}
							/>
							<span>{column.name}</span>
						</div>
					</KanbanHeader>
					<KanbanCards id={column.id}>
						{(todo: (typeof todos)[number]) => (
							<KanbanCard
								column={column.id}
								id={todo.id}
								key={todo.id}
								name={todo.name}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex flex-col gap-1">
										<p className="m-0 flex-1 font-medium text-sm">
											{todo.name}
										</p>
									</div>
									{/* {feature.owner && (
										<Avatar className="h-4 w-4 shrink-0">
											<AvatarImage
												src={feature.owner.image}
											/>
											<AvatarFallback>
												{feature.owner.name?.slice(
													0,
													2,
												)}
											</AvatarFallback>
										</Avatar>
									)} */}
								</div>
								{/* <p className="m-0 text-muted-foreground text-xs">
									{shortDateFormatter.format(todo.startAt)} -{" "}
									{dateFormatter.format(todo.endAt)}
								</p> */}
							</KanbanCard>
						)}
					</KanbanCards>

					<Button
						className="flex justify-start gap-2 text-base"
						variant={"ghost"}
						size="lg"
						onClick={() =>
							openTodoCreate$?.set({
								isOpen: true,
								column: column.id,
							})
						}
					>
						<PlusIcon className="w-4 h-4" />
						Create
					</Button>
				</KanbanBoard>
			)}
		</KanbanProvider>
	);
};
export default TodosKanban;
