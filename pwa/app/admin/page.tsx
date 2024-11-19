"use client";

import { useEffect, useState } from "react";
import { HydraAdmin } from "@api-platform/admin";

export default function Admin() {
  const [mounted, setMounted] = useState(false);
  const entrypoint = process.env.NEXT_PUBLIC_API_ENTRYPOINT || 'https://localhost';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <HydraAdmin
      entrypoint={entrypoint}
      basename="/admin"
    />
  );
}
