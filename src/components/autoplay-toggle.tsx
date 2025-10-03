"use client";

import { MonitorPause, MonitorPlay } from "lucide-react";
import { cloneElement, useMemo } from "react";

import { useObservable } from "../hooks/useObservable";
import { useUIStore } from "../lib/stores/ui-store";
import { Button } from "./ui/button";

export const AutoplayToggle = () => {
	const { autoplay$ } = useUIStore();
	const [autoplaying, setAutoplaying] = useObservable(autoplay$);

	const icon = useMemo(
		() => (autoplaying ? <MonitorPause /> : <MonitorPlay />),
		[autoplaying],
	);

	const handleToggle = () => setAutoplaying((playing) => !playing);

	return (
		<Button variant="outline" size="icon" onClick={handleToggle}>
			{cloneElement(icon, { className: "w-5 h-5" })}
		</Button>
	);
};
