"use client";

import { type PropsWithChildren, useEffect, useMemo, useState } from "react";
import { backButton, useLaunchParams } from "@telegram-apps/sdk-react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useTelegramMock } from "../hooks/useTelegramMock";
import { useDidMount } from "../hooks/useDidMount";
import { init } from '@telegram-apps/sdk-react';
import { BackButton } from "@/components/BackButton";



function RootInner({ children }: PropsWithChildren) {
  // Mock Telegram environment in development mode if needed.
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const debug = useLaunchParams().startParam === "debug";

  // Enable debug mode to see all the methods sent and events received.
  useEffect(() => {
    if (debug) {
      import("eruda").then((lib) => lib.default.init());
    }
  }, [debug]);

  init();

  backButton.mount();

  return (
    <>
      {children}
      <BackButton path="/play" />
    </>
  );
}

export function TelegramProvider(props: PropsWithChildren) {
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of the Server Side
  // Rendering. That's why we are showing loader on the server side.
  const didMount = useDidMount();

  return didMount ? (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  ) : (
    <div className=" absolute top-0 left-0 flex flex-col items-center  gap-4 justify-center w-full h-full">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="flex gap-4">
        <p>Loading</p>
      </div>
    </div>
  );
}