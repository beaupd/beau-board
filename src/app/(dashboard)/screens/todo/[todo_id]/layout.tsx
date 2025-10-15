import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { getTodo } from "@/src/lib/actions/notion/get-todo";
import { TodoStoreProvider } from "@/src/lib/stores/todo-store";

export default async function TodoLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ todo_id: string }>;
}) {
	const { todo_id } = await params;

	const todo = await getTodo(todo_id);

	return <TodoStoreProvider initial={{ todo }}>{children}</TodoStoreProvider>;
}
