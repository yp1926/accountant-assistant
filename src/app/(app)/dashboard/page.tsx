"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type Activity = {
  type: string;
  title: string;
  created_at: string;
};

export default function DashboardPage() {

  const supabase = createClient();

  const router = useRouter();

  const [businessName, setBusinessName] =
    useState("Accountant AI");

  const [totalClients, setTotalClients] =
    useState(0);

  const [pendingReminders, setPendingReminders] =
    useState(0);

  const [sentReminders, setSentReminders] =
    useState(0);

  const [overdueReminders, setOverdueReminders] =
    useState(0);

  const [dueSoonReminders, setDueSoonReminders] =
    useState(0);

  const [totalDocuments, setTotalDocuments] =
    useState(0);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  async function fetchDashboardData() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    // Profile
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("business_name")
        .eq("id", user.id)
        .single();

    if (profile?.business_name) {

      setBusinessName(
        profile.business_name
      );
    }

    // Clients Count
    const { count: clientsCount } =
      await supabase
        .from("clients")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

    setTotalClients(clientsCount || 0);

    // Pending Reminders
    const { count: pendingCount } =
      await supabase
        .from("reminders")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("status", "pending");

    setPendingReminders(
      pendingCount || 0
    );

    // Sent Reminders
    const { count: sentCount } =
      await supabase
        .from("reminders")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id)
        .eq("status", "sent");

    setSentReminders(
      sentCount || 0
    );

    // Documents Count
    const { count: documentsCount } =
      await supabase
        .from("documents")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

    setTotalDocuments(
      documentsCount || 0
    );

    // Due Analytics
    const { data: reminders } =
      await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id);

    if (reminders) {

      const today = new Date();

      let overdue = 0;

      let dueSoon = 0;

      reminders.forEach(
        (reminder) => {

          if (
            reminder.status === "sent"
          ) return;

          const dueDate =
            new Date(
              reminder.due_date
            );

          const diffTime =
            dueDate.getTime() -
            today.getTime();

          const diffDays =
            Math.ceil(
              diffTime /
              (
                1000 *
                60 *
                60 *
                24
              )
            );

          if (diffDays < 0) {

            overdue++;

          } else if (
            diffDays <= 7
          ) {

            dueSoon++;
          }
        }
      );

      setOverdueReminders(
        overdue
      );

      setDueSoonReminders(
        dueSoon
      );
    }

    // Recent Clients
    const { data: recentClients } =
      await supabase
        .from("clients")
        .select("name, created_at")
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    // Recent Reminders
    const { data: recentReminders } =
      await supabase
        .from("reminders")
        .select(
          "client_name, status, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    // Recent Documents
    const { data: recentDocuments } =
      await supabase
        .from("documents")
        .select(
          "file_name, created_at"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        })
        .limit(5);

    const clientActivities =
      (recentClients || []).map(
        (client: any) => ({
          type: "client",
          title:
            `New client added: ${client.name}`,
          created_at:
            client.created_at,
        })
      );

    const reminderActivities =
      (recentReminders || []).map(
        (reminder: any) => ({
          type: "reminder",
          title:
            `Reminder ${reminder.status} for ${reminder.client_name}`,
          created_at:
            reminder.created_at,
        })
      );

    const documentActivities =
      (recentDocuments || []).map(
        (doc: any) => ({
          type: "document",
          title:
            `Document uploaded: ${doc.file_name}`,
          created_at:
            doc.created_at,
        })
      );

    const mergedActivities = [
      ...clientActivities,
      ...reminderActivities,
      ...documentActivities,
    ];

    mergedActivities.sort(
      (a, b) =>
        new Date(
          b.created_at
        ).getTime() -
        new Date(
          a.created_at
        ).getTime()
    );

    setActivities(
      mergedActivities.slice(0, 10)
    );
  }

  useEffect(() => {

    fetchDashboardData();

  }, []);

  return (
    <div>

      {/* Header */}
      <div className="mb-10">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back, {businessName}
        </p>

      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

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

        <Card>
          <CardContent className="p-6">

            <h3 className="text-gray-500">
              Due Within 7 Days
            </h3>

            <p className="text-3xl font-bold mt-2 text-orange-500">
              {dueSoonReminders}
            </p>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">

            <h3 className="text-gray-500">
              Uploaded Documents
            </h3>

            <p className="text-3xl font-bold mt-2 text-blue-600">
              {totalDocuments}
            </p>

          </CardContent>
        </Card>

      </div>

      {/* Activity Timeline */}
      <Card>

        <CardContent className="p-8">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Recent Activity
            </h2>

            <p className="text-sm text-gray-500">
              Latest CRM actions
            </p>

          </div>

          <div className="space-y-4">

            {activities.length === 0 ? (

              <p className="text-gray-500">
                No recent activity yet.
              </p>

            ) : (

              activities.map(
                (
                  activity,
                  index
                ) => (

                  <div
                    key={index}
                    className="border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-all"
                  >

                    <div>

                      <p className="font-medium">
                        {activity.title}
                      </p>

                      <p className="text-sm text-gray-500 capitalize mt-1">
                        {activity.type}
                      </p>

                    </div>

                    <div className="text-sm text-gray-400">

                      {new Date(
                        activity.created_at
                      ).toLocaleDateString()}

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </CardContent>

      </Card>

    </div>
  );
}