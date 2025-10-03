"use client";

import { Status, StatusIndicator, StatusLabel } from "./ui/shadcn-io/status";

export const ConnectedStatus = () => {
	return (
		<Status status="online" variant="ghost">
			<StatusIndicator />
			<StatusLabel>Online</StatusLabel>
		</Status>
	);
};
