import { CurrentMonthPie } from "./current-month-pie";
import { HistoryBarChart } from "./history-bar-chart";

export default async function ExpensesScreen() {
	return (
		<div className="flex flex-col">
			<div className="flex gap-3 p-5">
				<HistoryBarChart />
				<CurrentMonthPie />
			</div>
		</div>
	);
}
