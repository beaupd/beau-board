"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/src/components/ui/dialog";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/src/components/ui/input-group";
import { useObservable } from "@/src/hooks/useObservable";
import { PushupPage } from "@/src/lib/interfaces/notion/pushup-page";
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

const pushupsCreationSchema = z.object({
	pushupsAmount: z.number(),
});

export const PushupsCreatePageOverlay = () => {
	const { pushups$ } = useDataStore();
	const { openPushupsEntryCreate$ } = useUIStore();
	const [{ isOpen }] = useObservable(openPushupsEntryCreate$, {
		isOpen: false,
	});

	const form = useForm({
		resolver: zodResolver(pushupsCreationSchema),
		defaultValues: {
			pushupsAmount: 0,
		} as z.infer<typeof pushupsCreationSchema>,
	});

	const handleSubmit = async (
		data: z.infer<typeof pushupsCreationSchema>,
	) => {
		pushups$?.temp.set(
			PushupPage.createFromData({
				amount: data.pushupsAmount,
			}) as any,
		);
		openPushupsEntryCreate$?.set({ isOpen: false });
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={openPushupsEntryCreate$?.isOpen.set}
		>
			<Button
				variant="outline"
				className="shadow"
				size="lg"
				onClick={() => openPushupsEntryCreate$?.isOpen.set(true)}
			>
				<Plus />
				Add pushups entry
			</Button>

			<DialogContent aria-describedby={undefined}>
				<DialogHeader>
					<DialogTitle>Add pushups entry</DialogTitle>

					<section className="mt-3">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(handleSubmit)}>
								<FieldSet>
									<FieldGroup>
										<Field>
											<FieldLabel htmlFor="pushupsAmount">
												Pushups amount
											</FieldLabel>
											<FormField
												control={form.control}
												name="pushupsAmount"
												render={({ field }) => (
													<InputGroup className="h-12 px-1">
														<InputGroupAddon align="inline-start">
															<InputGroupButton
																aria-label="Minus 10"
																title="Minus 10"
																size="sm"
																onClick={() => {
																	form.setValue(
																		field.name,
																		field.value -
																			10,
																	);
																}}
																variant={
																	"outline"
																}
															>
																-10
															</InputGroupButton>
														</InputGroupAddon>
														<InputGroupAddon align="inline-start">
															<InputGroupButton
																aria-label="Minus one"
																title="Minus one"
																size="icon-sm"
																variant={
																	"outline"
																}
																onClick={() => {
																	form.setValue(
																		field.name,
																		field.value -
																			1,
																	);
																}}
															>
																-
															</InputGroupButton>
														</InputGroupAddon>
														<InputGroupInput
															placeholder="0"
															{...field}
															className="mx-2"
														/>
														<InputGroupAddon align="inline-end">
															<InputGroupButton
																aria-label="Plus one"
																title="Plus one"
																size="icon-sm"
																variant={
																	"outline"
																}
																onClick={() => {
																	form.setValue(
																		field.name,
																		field.value +
																			1,
																	);
																}}
															>
																+
															</InputGroupButton>
														</InputGroupAddon>
														<InputGroupAddon align="inline-end">
															<InputGroupButton
																aria-label="Plus ten"
																title="Plus ten"
																size="sm"
																variant={
																	"outline"
																}
																onClick={() => {
																	form.setValue(
																		field.name,
																		field.value +
																			10,
																	);
																}}
															>
																+10
															</InputGroupButton>
														</InputGroupAddon>
													</InputGroup>
												)}
											/>

											<FieldDescription>
												Type the amount of pushups to
												add
											</FieldDescription>
										</Field>

										<Field>
											<Button>Add entry</Button>
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
