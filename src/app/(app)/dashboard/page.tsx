"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

type Reminder = {
  id: number;
  client_name: string;
  message: string;
  due_date: string;
  status: string;
};

export default function DashboardPage() {

  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [totalClients, setTotalClients] =
    useState(0);

  const [pendingReminders, setPendingReminders] =
    useState(0);

  const [sentReminders, setSentReminders] =
    useState(0);

  const [overdueReminders, setOverdueReminders] =
    useState(0);

  const [upcomingReminders, setUpcomingReminders] =
    useState<Reminder[]>([]);

  const [recentReminders, setRecentReminders] =
    useState<Reminder[]>([]);

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

    // Pending Reminders Count
    const { count: pendingCount } = await supabase
      .from("reminders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user?.id)
      .eq("status", "pending");

    setPendingReminders(pendingCount || 0);

    // Sent Reminders Count
    const { count: sentCount } = await supabase
      .from("reminders")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user?.id)
      .eq("status", "sent");

    setSentReminders(sentCount || 0);

    // Upcoming Reminders
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const { data: upcomingData } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user?.id)
      .gte("due_date", today)
      .order("due_date", {
        ascending: true,
      })
      .limit(5);

    setUpcomingReminders(upcomingData || []);

    // Recent Reminders
    const { data: recentData } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user?.id)
      .order("id", {
        ascending: false,
      })
      .limit(5);

    setRecentReminders(recentData || []);

    // Overdue Reminders
    const { data: overdueData } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user?.id)
      .eq("status", "pending")
      .lt("due_date", today);

    setOverdueReminders(
      overdueData?.length || 0
    );
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
    <div className="space-y-8">

      {/* Top Bar */}
      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold">
            Dashboard
          </h2>

          <p className="text-gray-500 mt-1">
            Logged in as: {email}
          </p>

        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

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

            <p className="text-3xl font-bold mt-2 text-yellow-600">
              {pendingReminders}
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <h3 className="text-gray-500">
              Sent Reminders
            </h3>

            <p className="text-3xl font-bold mt-2 text-green-600">
              {sentReminders}
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <h3 className="text-gray-500">
              Overdue Reminders
            </h3>

            <p className="text-3xl font-bold mt-2 text-red-600">
              {overdueReminders}
            </p>

          </CardContent>
        </Card>

      </div>

      {/* Upcoming + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Upcoming Reminders */}
        <Card>

          <CardContent className="p-6">

            <h3 className="text-2xl font-bold mb-4">
              Upcoming Reminders
            </h3>

            <div className="space-y-4">

              {upcomingReminders.length === 0 ? (

                <p className="text-gray-500">
                  No upcoming reminders.
                </p>

              ) : (

                upcomingReminders.map((reminder) => (

                  <div
                    key={reminder.id}
                    className="border rounded p-4"
                  >

                    <div className="flex items-center justify-between">

                      <h4 className="font-semibold">
                        {reminder.client_name}
                      </h4>

                      <span className="text-sm text-gray-500">
                        {reminder.due_date}
                      </span>

                    </div>

                    <p className="text-gray-600 mt-2">
                      {reminder.message}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded text-sm text-white ${
                        reminder.status === "sent"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {reminder.status}
                    </span>

                  </div>
                ))
              )}

            </div>

          </CardContent>

        </Card>

        {/* Recent Activity */}
        <Card>

          <CardContent className="p-6">

            <h3 className="text-2xl font-bold mb-4">
              Recent Activity
            </h3>

            <div className="space-y-4">

              {recentReminders.length === 0 ? (

                <p className="text-gray-500">
                  No recent activity.
                </p>

              ) : (

                recentReminders.map((reminder) => (

                  <div
                    key={reminder.id}
                    className="border rounded p-4"
                  >

                    <div className="flex items-center justify-between">

                      <h4 className="font-semibold">
                        {reminder.client_name}
                      </h4>

                      <span className="text-sm text-gray-500">
                        {reminder.due_date}
                      </span>

                    </div>

                    <p className="text-gray-600 mt-2">
                      {reminder.message}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded text-sm text-white ${
                        reminder.status === "sent"
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {reminder.status}
                    </span>

                  </div>
                ))
              )}

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}