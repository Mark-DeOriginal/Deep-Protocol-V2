"use client";

import Home from "../../page";
import { useEffect, use } from "react";

export default function RefPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  useEffect(() => {
    if (code) {
      localStorage.setItem("deep-protocol-ref", code);
    }
  }, [code]);
  return <Home />;
}
