"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";

type RouterTransitionStage = "entering" | "leaving" | undefined;

type RouterTransition = {
  isPending: boolean;
  stage: RouterTransitionStage;
};

type RouterTransitionStartFunction = (
  callback: () => void | Promise<void>
) => void;

type RouterTransitionContext = [
  transition: RouterTransition,
  startRouteTransition: RouterTransitionStartFunction
];

const RouterTransitionContext = createContext<RouterTransitionContext | null>(
  null
);

if (process.env.NODE_ENV === "development") {
  RouterTransitionContext.displayName = "RouterTransitionContext";
}

export function useRouterTransition() {
  const context = useContext(RouterTransitionContext);

  if (!context) {
    throw Error("Used RouterTransitionContext outside provider");
  }

  return context;
}

type RouterTransitionCallback = () => Promise<void | VoidFunction>;

export function TransitionLink(props: ComponentProps<typeof Link>) {
  const [, startRouteTransition] = useRouterTransition();
  const router = useRouter();

  return (
    <Link
      {...props}
      onNavigate={(event) => {
        event.preventDefault();
        startRouteTransition(() => {
          const method = props.shallow
            ? props.replace
              ? window.history.replaceState.bind(null, null, "")
              : window.history.pushState.bind(null, null, "")
            : props.replace
            ? router.replace
            : router.push;

          method(props.href.toString(), {
            scroll: props.scroll,
          });
        });
      }}
    />
  );
}

export function RouterTransition({
  children,
  leave,
  enter,
}: PropsWithChildren<{
  leave: RouterTransitionCallback;
  enter: RouterTransitionCallback;
}>) {
  const [shouldEnter, setShouldEnter] = useState(false);
  const [stage, setStage] = useState<RouterTransitionStage>();
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!shouldEnter) return;

    setStage("entering");
    startTransition(async () => {
      await enter().then((cleanup) => cleanup?.());
      setStage(undefined);
      setShouldEnter(false);
    });
  }, [enter, shouldEnter]);

  const startRouteTransition: RouterTransitionStartFunction = (callback) => {
    if (stage) return;
    setStage("leaving");
    startTransition(async () => {
      setShouldEnter(true);
      await leave().then((cleanup) => cleanup?.());
      await callback();
    });
  };

  const value: RouterTransitionContext = [
    {
      isPending: Boolean(stage),
      stage,
    },
    startRouteTransition,
  ];

  return (
    <RouterTransitionContext value={value}>{children}</RouterTransitionContext>
  );
}
