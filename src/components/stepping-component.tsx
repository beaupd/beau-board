"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperTrigger,
} from "@/src/components/ui/stepper";
import { ScreensConfig } from "@/src/config/screens";
import { useObservable } from "@/src/hooks/useObservable";
import { useUIStore } from "@/src/lib/stores/ui-store";

const steps = ScreensConfig;
const AUTOPLAY_DELAY_MS = 30000;

export default function SteppingComponent() {
	const { currentStep$, autoplay$ } = useUIStore();
	const [currentStep, setCurrentStep] = useObservable(currentStep$);
	const [autoPlay] = useObservable(autoplay$);

	const router = useRouter();

	const handleNext = useCallback(
		() =>
			currentStep === steps.length
				? setCurrentStep(1)
				: setCurrentStep((prev) => prev + 1),
		[currentStep, setCurrentStep],
	);

	const handlePrevious = useCallback(
		() =>
			currentStep === 1
				? setCurrentStep(steps.length)
				: setCurrentStep((prev) => prev - 1),
		[currentStep, setCurrentStep],
	);

	useEffect(() => {
		let autoplayer: NodeJS.Timeout;
		if (autoPlay) {
			autoplayer = setInterval(handleNext, AUTOPLAY_DELAY_MS);
		}
		return () => {
			if (autoplayer) clearInterval(autoplayer);
		};
	}, [autoPlay, handleNext]);

	useEffect(() => {
		const step = steps[currentStep - 1];
		if (step) {
			router.push(`/screens/${step.url}`);
		}
	}, [currentStep, router]);

	return (
		<div className="mx-auto max-w-xl space-y-8 text-center">
			<div className="flex items-center gap-2">
				<Button
					className="shrink-0"
					variant="ghost"
					size="icon"
					onClick={handlePrevious}
					aria-label="Prev step"
				>
					<ChevronLeftIcon size={16} aria-hidden="true" />
				</Button>
				<Stepper
					value={currentStep}
					onValueChange={setCurrentStep}
					className="gap-1"
				>
					{steps.map((_, step) => (
						<StepperItem key={step} step={step} className="flex-1">
							<StepperTrigger
								className="w-full flex items-center gap-2"
								asChild
							>
								<span
									className="bg-transparent h-6"
									onClick={() => {
										setCurrentStep(step);
									}}
								>
									<StepperIndicator
										asChild
										className="bg-border h-1 w-full"
									>
										<span className="sr-only">{step}</span>
									</StepperIndicator>
								</span>
							</StepperTrigger>
						</StepperItem>
					))}
				</Stepper>
				<Button
					className="shrink-0"
					variant="ghost"
					size="icon"
					onClick={handleNext}
					aria-label="Next step"
				>
					<ChevronRightIcon size={16} aria-hidden="true" />
				</Button>
			</div>
		</div>
	);
}
