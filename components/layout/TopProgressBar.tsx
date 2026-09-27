"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [, startTransition] = useTransition();

  const currentRoute = `${pathname || ""}?${searchParams ? searchParams.toString() : ""}`;
  const [prevRoute, setPrevRoute] = useState(currentRoute);

  if (prevRoute !== currentRoute) {
    setPrevRoute(currentRoute);
    if (visible || isNavigating) {
      setProgress(100);
    }
  }

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
        setIsNavigating(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("http")) return;

      const url = new URL(href, window.location.href);
      if (url.origin === window.location.origin && (url.pathname !== window.location.pathname || url.search !== window.location.search)) {
        startTransition(() => {
          setVisible(true);
          setIsNavigating(true);
          setProgress(25);
        });
      }
    };

    window.addEventListener("click", handleAnchorClick, { capture: true });
    return () => window.removeEventListener("click", handleAnchorClick, { capture: true });
  }, []);

  useEffect(() => {
    if (!isNavigating) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 80 ? prev + 15 : prev));
    }, 150);
    return () => clearInterval(interval);
  }, [isNavigating]);

  if (!visible && progress === 0) {
    return (
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none opacity-0 transition-opacity duration-200"
        aria-hidden="true"
      >
        <div className="h-full w-0 bg-[#FFD166] shadow-[0_0_8px_rgba(255,209,102,0.8)]" />
      </div>
    );
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none transition-opacity duration-200"
      style={{ opacity: visible || progress > 0 ? 1 : 0 }}
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#99F6E4] via-[#FFD166] to-[#FF6B6B] shadow-[0_0_12px_rgba(255,209,102,0.9)] transition-all ease-out duration-200"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
