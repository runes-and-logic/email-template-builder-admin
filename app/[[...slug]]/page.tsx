import { redirect } from "next/navigation";
import AdminApp from "@/components/admin-app";
export default function Page() {
  if (process.env.NEXT_PUBLIC_APP_MODE === "cloud") {
    const url = process.env.CUSTOMER_APP_URL;
    if (!url) throw new Error("CUSTOMER_APP_URL is required in cloud mode.");
    redirect(new URL("/platform", url).toString());
  }
  return <AdminApp />;
}
