"use client";

import { format } from "date-fns";
import { CalendarClock, ChartLine, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { useObservable } from "@/src/hooks/useObservable";
import type { PushupPage } from "@/src/lib/interfaces/notion/pushup-page";
import { useDataStore } from "@/src/lib/stores/data-store";
import { totalPushupsByEntries } from "@/src/lib/utils/total-pushups-by-entries";

export const PushupsHeaderCards = () => {
	const {
		daysLeftInYear$,
		averagePerDayNeeded$,
		entriesGroupedByDay$,
		today$,
	} = useDataStore();
	const [daysLeftInYear] = useObservable(daysLeftInYear$, 0);
	const [averagePerDayNeeded] = useObservable(averagePerDayNeeded$, "10000");
	const [entriesGroupedByDay] = useObservable(
		entriesGroupedByDay$,
		{} as Record<string, PushupPage<false>[]>,
	);
	const [today] = useObservable(today$, format(Date.now(), "yyyy-MM-dd"));


	return (
		<header className="flex gap-3">
			<Card className="flex-1 ">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Average per day
					</CardTitle>
					<ChartLine className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{averagePerDayNeeded}
					</div>
					{/* <p className="text-xs text-muted-foreground">
						-20.1% from last month
					</p> */}
				</CardContent>
			</Card>
			<Card className="flex-1">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Days left
					</CardTitle>
					<CalendarClock className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{daysLeftInYear}</div>
				</CardContent>
			</Card>
			<Card className="flex-1">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total today
					</CardTitle>
					<ChartLine className="h-4 w-4 text-muted-foreground" />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						{totalPushupsByEntries(entriesGroupedByDay[today])}
					</div>
					{/* <p className="text-xs text-muted-foreground">
						20.5% of average
					</p> */}
				</CardContent>
			</Card>
		</header>
	);
};
