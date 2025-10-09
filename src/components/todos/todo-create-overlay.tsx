"use client";

import { Description } from "@radix-ui/react-dialog";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import { useObservable } from "@/src/hooks/useObservable";
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

export const TodoPageOverlay = () => {
	const { todoColumns$ } = useDataStore();
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
		defaultValues: {
			todoName: "",
			column,
		},
	});

	useEffect(() => {
		if (activeColumn) form.setValue("column", activeColumn.id);
	}, [activeColumn, form]);

	const handleSubmit = async () => {};

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
