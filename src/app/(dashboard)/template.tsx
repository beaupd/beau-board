import ScreenTransitionWrapper from "@/src/components/screen-transition-wrapper";
import TemplateWrapper from "@/src/components/template-wrapper";
import { ReactNode } from "react";

export default async function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <TemplateWrapper>{children}</TemplateWrapper>;
}
