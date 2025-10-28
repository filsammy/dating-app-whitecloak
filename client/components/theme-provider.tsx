"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Prevent rendering until theme is mounted to avoid hydration mismatch
  if (!mounted) return <>{children}</>;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
