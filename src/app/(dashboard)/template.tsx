import type { ReactNode } from "react";
import TemplateWrapper from "@/src/components/template-wrapper";

export default async function DashboardTemplate({
	children,
}: {
	children: ReactNode;
}) {
	return <TemplateWrapper>{children}</TemplateWrapper>;
}
