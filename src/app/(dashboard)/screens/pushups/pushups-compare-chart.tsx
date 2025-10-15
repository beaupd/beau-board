"use client";

import { format } from "date-fns";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/src/components/ui/chart";
import { useObservable } from "@/src/hooks/useObservable";
import type { PushupPage } from "@/src/lib/interfaces/notion/pushup-page";
import { useDataStore } from "@/src/lib/stores/data-store";
import { getWeekDays } from "@/src/lib/utils/get-week-days";
import { totalPushupsByEntries } from "@/src/lib/utils/total-pushups-by-entries";

export const description = "A multiple bar chart";

const days = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const chartConfig = {
	current: {
		label: "Current",
		color: "var(--chart-1)",
	},
	previous: {
		label: "Previous",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export function PushupsCompareChart() {
	const { entriesGroupedByDay$ } = useDataStore();
	const [entriesGroupedByDay] = useObservable(
		entriesGroupedByDay$,
		{} as Record<string, PushupPage<false>[]>,
	);

	const chartData = useMemo(() => {
		const thisWeek = getWeekDays("this").map((d) =>
			format(d, "yyyy-MM-dd"),
		);
		const previousWeek = getWeekDays("last").map((d) =>
			format(d, "yyyy-MM-dd"),
		);

		return days.map((day, index) => ({
			day,
			current: totalPushupsByEntries(
				entriesGroupedByDay[thisWeek[index]],
			),
			previous: totalPushupsByEntries(
				entriesGroupedByDay[previousWeek[index]],
			),
		}));
	}, [entriesGroupedByDay]);

	return (
		<Card className="flex-2">
			<CardHeader>
				<CardTitle>Pushups compare chart</CardTitle>
				<CardDescription>
					Pushups this week compared to average
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer
					config={chartConfig}
					className="h-[200px] w-full"
				>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="day"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={(value) => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dashed" />}
						/>
						<Bar
							dataKey="current"
							fill="var(--color-current)"
							radius={4}
						/>
						<Bar
							dataKey="previous"
							fill="var(--color-previous)"
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 leading-none font-medium">
					Trending up by 5.2% this month{" "}
					<TrendingUp className="h-4 w-4" />
				</div>
				<div className="text-muted-foreground leading-none">
					Showing total visitors for the last 6 months
				</div>
			</CardFooter>
		</Card>
	);
}
