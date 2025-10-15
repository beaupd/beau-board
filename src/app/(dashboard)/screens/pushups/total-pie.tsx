"use client";

import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "@/src/components/ui/chart";
import { useObservable } from "@/src/hooks/useObservable";
import { useDataStore } from "@/src/lib/stores/data-store";

export const description = "A pie chart with a legend";

const chartData = [
	{ label: "chrome", amount: 275, fill: "var(--color-chrome)" },
	{ label: "safari", amount: 200, fill: "var(--color-safari)" },
];

const chartConfig = {
	amount: {
		label: "Amount",
	},
	total: {
		label: "Total",
		color: "var(--chart-1)",
	},
	done: {
		label: "Done",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

export function TotalPie() {
	const { totalPushups$ } = useDataStore();
	const [totalPushups] = useObservable(totalPushups$);

	const chartData = useMemo(() => {
		return [
			{
				label: "total",
				amount: 10000,
				fill: "var(--color-total)",
			},
			{ label: "done", amount: totalPushups, fill: "var(--color-done)" },
		];
	}, [totalPushups]);

	return (
		<Card className="flex flex-col flex-1">
			<CardHeader className="items-center pb-0">
				<CardTitle>Total pushups done</CardTitle>
				<CardDescription>2025</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[300px]"
				>
					<PieChart>
						<Pie data={chartData} dataKey="amount" />
						<ChartLegend
							content={<ChartLegendContent nameKey="label" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
