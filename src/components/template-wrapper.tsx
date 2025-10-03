"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function TemplateWrapper({ children }: { children: ReactNode }) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -50 }}
			transition={{ duration: 0.4, ease: "easeInOut" }}
			className="w-full h-full"
		>
			{children}
		</motion.div>
	);
}
