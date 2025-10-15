import { PushupsCreatePageOverlay } from "@/src/components/pushups/pushups-create-overlay";
import { PushupsHeaderCards } from "@/src/components/pushups/pushups-header-cards";

import { PushupsCompareChart } from "./pushups-compare-chart";
import { TotalPie } from "./total-pie";

export default async function PushupsPage() {
	return (
		<section className="flex flex-col w-full gap-3 flex-1 p-5">
			<PushupsHeaderCards />

			<main className="flex gap-3">
				<PushupsCompareChart />
				<TotalPie />
			</main>

			<footer className="flex gap-3 flex-1 justify-end">
				<PushupsCreatePageOverlay />
			</footer>
		</section>
	);
}
