import { AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export default async function TodoLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
