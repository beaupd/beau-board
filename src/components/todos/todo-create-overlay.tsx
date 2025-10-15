"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { useObservable } from "@/src/hooks/useObservable";
import { TodoPage } from "@/src/lib/interfaces/notion/todo-page";
import { useDataStore } from "@/src/lib/stores/data-store";
import { useUIStore } from "@/src/lib/stores/ui-store";
import { Button } from "../ui/button";
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSet,
} from "../ui/field";
import { Form, FormField } from "../ui/form";
import { Input } from "../ui/input";

const todoCreationSchema = z.object({
	todoName: z.string(),
	column: z.string(),
});

export const TodoPageOverlay = () => {
	const { todoColumns$, todos$ } = useDataStore();
	const { openTodoCreate$ } = useUIStore();
	const [columns] = useObservable(todoColumns$);
	const [{ isOpen, column }] = useObservable(openTodoCreate$, {
		isOpen: false,
		column: null,
	});

	const activeColumn = useMemo(() => {
		return columns?.find(({ id }) => id === column);
	}, [column, columns]);

	const form = useForm({
		resolver: zodResolver(todoCreationSchema),
		defaultValues: {
			todoName: "",
			column,
		} as z.infer<typeof todoCreationSchema>,
	});

	useEffect(() => {
		if (activeColumn) form.setValue("column", activeColumn.id);
	}, [activeColumn, form]);

	const handleSubmit = async (data: z.infer<typeof todoCreationSchema>) => {
		todos$?.temp.set(
			TodoPage.createFromData({
				name: data.todoName,
				column: data.column,
			}) as any,
		);
		openTodoCreate$?.set({ isOpen: false, column: null });
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(open) => {
				if (open === false)
					openTodoCreate$?.set({ isOpen: false, column: null });
				else openTodoCreate$?.isOpen.set(open);
			}}
		>
			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>
						{activeColumn
							? `Add todo to "${activeColumn.name}"`
							: "Create todo"}
					</DialogTitle>

					<section className="mt-3">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)}>
								<FieldSet>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="todoName">
												Todo Name
											</FieldLabel>
											<FormField
												control={form.control}
												name="todoName"
												render={({ field }) => (
													<Input
														id="todoName"
														type="text"
														placeholder="A todo"
														{...field}
													/>
												)}
											/>

											<FieldDescription>
												Type a name for this todo
											</FieldDescription>
										</Field>

										<Field>
											<Button>Create</Button>
										</Field>
									</FieldGroup>
								</FieldSet>
							</form>
						</Form>
					</section>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};
