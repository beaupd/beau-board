"use client";

import { motion } from "framer-motion";
import { isEqual, isMatch } from "lodash";
import { AlertCircle, MoveLeft } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useEffect, useState } from "react";
import { PlateEditor } from "@/src/components/editor/plate-editor";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { useObservable } from "@/src/hooks/useObservable";
import { useTodoStore } from "@/src/lib/stores/todo-store";
import { cn } from "@/src/lib/utils";

export default function TodoPageClient() {
	const { todo$, changing$, initialNodes$, discardChanges, saveChanges } =
		useTodoStore();
	const [todo] = useObservable(todo$);
	const [changing] = useObservable(changing$, false);

	return (
		<div className="flex flex-col flex-1 overflow-scroll relative">
			{changing ? (
				<div className="sm:px-[max(64px,calc(50%-350px))] mb-2">
					<Alert className="relative py-2 flex items-center gap-3  z-50 bg-blue-50 text-blue-500 border-blue-200">
						<div>
							<AlertCircle className="h-5 w-5" />
						</div>

						<AlertDescription
							className="flex items-center h-full translate-y-0 leading-none font-medium"
							style={
								{
									"--tw-translate-y": "0px",
								} as CSSProperties
							}
						>
							<span>This workflow has unsaved changes</span>
						</AlertDescription>

						<Button
							variant={"ghost"}
							size="sm"
							className="ml-auto hover:bg-transparent hover:text-blue-900"
							onClick={discardChanges ?? undefined}
						>
							Discard changes
						</Button>
						<Button
							variant={"outline"}
							size="sm"
							className="bg-blue-500 text-blue-50 hover:bg-blue-100 hover:text-blue-900"
							onClick={saveChanges ?? undefined}
						>
							Save changes
						</Button>
					</Alert>
				</div>
			) : null}
			<header className="sm:px-[max(64px,calc(50%-350px))]">
				<div className="mt-4 mb-5 -translate-x-2">
					<Link
						className={cn(buttonVariants({ variant: "ghost" }), "")}
						href={`/screens/todo`}
					>
						<MoveLeft className="w-4 h-4" />
						Back to todos
					</Link>
				</div>
				<div className="flex flex-1 gap-3 justify-start text-left -indent-2">
					<motion.div
						className="flex flex-col gap-1 ml-2"
						layoutId={`todo-${todo?.id}-name`}
					>
						<p className="m-0 flex-1 font-bold text-4xl">
							{todo?.properties.Name.title[0].text.content}
						</p>
					</motion.div>
				</div>
			</header>

			<PlateEditor />
		</div>
	);
}
