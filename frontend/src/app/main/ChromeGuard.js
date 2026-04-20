"use client";

import { usePathname } from "next/navigation";

const HIDE_PATHS = [
  "/adminrohpnl",
  "/auth",
  "/dashboard",
  "/add-item",
  "/agents/register-vendors",
];

export default function ChromeGuard({ children }) {

  const pathname = usePathname();

  const hideChrome = HIDE_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (hideChrome) return null;

  return children;
}