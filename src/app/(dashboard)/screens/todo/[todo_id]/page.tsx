import { getTodo } from "@/src/lib/actions/notion/get-todo";
import TodoPageClient from "./page-client";

export default async function TodoPage() {
	return <TodoPageClient />;
}
