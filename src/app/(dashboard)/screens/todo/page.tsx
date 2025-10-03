import TodosKanban from "./todos-kanban";

export default async function ToDoPage() {
	return (
		<div className="flex flex-col flex-1 overflow-scroll">
			<div className="flex flex-1 gap-3 p-5">
				<TodosKanban />
			</div>
		</div>
	);
}
