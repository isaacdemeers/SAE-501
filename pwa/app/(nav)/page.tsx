import React, { Suspense } from "react";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Chargement du tableau de bord...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
