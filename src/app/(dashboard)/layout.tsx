import type { ReactNode } from "react";
import { AutoplayToggle } from "@/src/components/autoplay-toggle";
import { ConnectedStatus } from "@/src/components/connected-status";
import ScreenTransitionWrapper from "@/src/components/screen-transition-wrapper";
import SteppingComponent from "@/src/components/stepping-component";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { DataStoreProvider } from "@/src/lib/stores/data-store";
import { UIStoreProvider } from "@/src/lib/stores/ui-store";

export default async function DashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<DataStoreProvider initial={{}}>
			<UIStoreProvider initial={{}}>
				<SidebarProvider
					style={
						{
							"--sidebar-width": "calc(var(--spacing) * 72)",
							"--header-height": "calc(var(--spacing) * 12)",
						} as React.CSSProperties
					}
					defaultOpen={false}
				>
					<Sidebar collapsible="offcanvas" variant="inset">
						<SidebarHeader>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										asChild
										className="data-[slot=sidebar-menu-button]:!p-1.5"
									>
										<span className="text-base font-semibold">
											Acme Inc.
										</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarHeader>

						<SidebarContent></SidebarContent>
						{/* <SidebarFooter>

       				</SidebarFooter> */}
					</Sidebar>

					<SidebarInset className="relative">
						<header className="flex h-(--header-height) shrink-0 items-center gap-2 justify-between transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
							<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
								<SidebarTrigger className="-ml-1" />
							</div>

							<div className="mr-4">
								<ConnectedStatus />
							</div>
						</header>

						<ScreenTransitionWrapper>
							{children}
						</ScreenTransitionWrapper>

						<footer className="absolute left-0 bottom-5 w-full">
							<div className="relative w-full h-full">
								<SteppingComponent />

								<div className="absolute right-5 bottom-0">
									<AutoplayToggle />
								</div>
							</div>
						</footer>
					</SidebarInset>
				</SidebarProvider>
			</UIStoreProvider>
		</DataStoreProvider>
	);
}
