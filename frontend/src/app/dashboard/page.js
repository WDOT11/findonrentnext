import Seo from "../../components/seo/Seo";
import DashboardClient from "./DashboardClient";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <>
      <Seo slug="/dashboard/" />

      <Suspense fallback={<div>Loading Dashboard...</div>}>
        <DashboardClient />
      </Suspense>
    </>
  );
}
