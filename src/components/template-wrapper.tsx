"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function TemplateWrapper({ children }: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			className="w-full h-full"
		>
			{children}
		</motion.div>
	);
}
