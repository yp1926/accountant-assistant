"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {

  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [totalClients, setTotalClients] =
    useState(0);

  const [pendingReminders, setPendingReminders] =
    useState(0);

  async function fetchDashboardData() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Clients Count
    const { count: clientsCount } = await supabase
      .from("clients")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user?.id);

    setTotalClients(clientsCount || 0);

    // Reminders Count
    const { count: remindersCount } = await supabase
      .from("reminders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user?.id)
      .eq("status", "pending");

    setPendingReminders(remindersCount || 0);
  }

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setEmail(user.email || "");
      }
    }

    checkUser();
    fetchDashboardData();
  }, []);

  return (
    <div>

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Logged in as: {email}
          </p>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card>
          <CardContent className="p-6">
            <h3 className="text-gray-500">
              Total Clients
            </h3>

            <p className="text-3xl font-bold mt-2">
              {totalClients}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-gray-500">
              Pending Reminders
            </h3>

            <p className="text-3xl font-bold mt-2">
              {pendingReminders}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-gray-500">
              Uploaded Documents
            </h3>

            <p className="text-3xl font-bold mt-2">
              0
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}