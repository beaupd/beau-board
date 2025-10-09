"use client";

import { createElement } from "react";
import { dockItems } from "../config/dock-items";
import { Dock, DockIcon, DockItem, DockLabel } from "./ui/shadcn-io/dock";

export const DockMenu = () => {
	return (
		<Dock className="items-end pb-3 bg-accent/40">
			{dockItems.map((item, idx) => (
				<DockItem
					key={idx}
					className="aspect-square rounded-full bg-accent dark:bg-neutral-800"
					link={item.href}
				>
					<DockLabel>{item.title}</DockLabel>
					<DockIcon>
						{createElement(item.icon, {
							className:
								"h-full w-full text-neutral-600 dark:text-neutral-300",
						})}
					</DockIcon>
				</DockItem>
			))}
		</Dock>
	);
};
