"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/lib/client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Users,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  FileText,
  ArrowRight,
  Upload,
  UserPlus,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Activity = {
  type: string;
  title: string;
  created_at: string;
};

export default function DashboardPage() {

  const supabase = createClient();

  const [businessName, setBusinessName] =
    useState("TaxNest");

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

    // Profile
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("business_name")
        .eq("id", user?.id)
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
        .eq("user_id", user?.id);

    setTotalClients(clientsCount || 0);

    // Pending Reminders
    const { count: pendingCount } =
      await supabase
        .from("reminders")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user?.id)
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
        .eq("user_id", user?.id)
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
        .eq("user_id", user?.id);

    setTotalDocuments(
      documentsCount || 0
    );

    // Reminder Analytics
    const { data: reminders } =
      await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user?.id);

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
        .eq("user_id", user?.id)
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
        .eq("user_id", user?.id)
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
        .eq("user_id", user?.id)
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

  const reminderPieData = [
    {
      name: "Pending",
      value: pendingReminders,
      color: "#eab308",
    },
    {
      name: "Sent",
      value: sentReminders,
      color: "#22c55e",
    },
    {
      name: "Overdue",
      value: overdueReminders,
      color: "#ef4444",
    },
  ];

  const reminderBarData = [
    {
      name: "Pending",
      value: pendingReminders,
    },
    {
      name: "Sent",
      value: sentReminders,
    },
    {
      name: "Overdue",
      value: overdueReminders,
    },
    {
      name: "Due Soon",
      value: dueSoonReminders,
    },
  ];

  return (
    <div className="space-y-10">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-10 text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

                TaxNest Dashboard

              </div>

              <h1 className="text-4xl font-bold leading-tight">

                Welcome back,
                <br />
                {businessName}

              </h1>

              <p className="text-blue-100 mt-5 text-lg max-w-2xl leading-relaxed">

                Monitor reminders, clients and accounting
                operations from your centralized workspace.

              </p>

            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[320px]">

              <Link
                href="/clients"
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-5 transition backdrop-blur-sm"
              >

                <UserPlus size={24} />

                <h3 className="font-semibold mt-4">
                  Add Client
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Create a new client profile.
                </p>

              </Link>

              <Link
                href="/reminders"
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-5 transition backdrop-blur-sm"
              >

                <Bell size={24} />

                <h3 className="font-semibold mt-4">
                  Add Reminder
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Schedule client reminders.
                </p>

              </Link>

              <Link
                href="/documents"
                className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-5 transition backdrop-blur-sm"
              >

                <Upload size={24} />

                <h3 className="font-semibold mt-4">
                  Upload Docs
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Store client documents securely.
                </p>

              </Link>

            </div>

          </div>

        </div>

      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <AnalyticsCard
          title="Total Clients"
          value={totalClients}
          icon={<Users size={28} />}
          color="blue"
        />

        <AnalyticsCard
          title="Pending Reminders"
          value={pendingReminders}
          icon={<Clock3 size={28} />}
          color="yellow"
        />

        <AnalyticsCard
          title="Sent Reminders"
          value={sentReminders}
          icon={<CheckCircle2 size={28} />}
          color="green"
        />

        <AnalyticsCard
          title="Overdue"
          value={overdueReminders}
          icon={<AlertTriangle size={28} />}
          color="red"
        />

        <AnalyticsCard
          title="Due Within 7 Days"
          value={dueSoonReminders}
          icon={<Bell size={28} />}
          color="orange"
        />

        <AnalyticsCard
          title="Documents"
          value={totalDocuments}
          icon={<FileText size={28} />}
          color="blue"
        />

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <Card className="border-0 shadow-md rounded-3xl">

          <CardContent className="p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-bold">
                Reminder Status
              </h2>

              <p className="text-gray-500 mt-2">
                Overview of reminder distribution.
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={reminderPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                  >

                    {reminderPieData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={entry.color}
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

        {/* Bar Chart */}
        <Card className="border-0 shadow-md rounded-3xl">

          <CardContent className="p-8">

            <div className="mb-8">

              <h2 className="text-2xl font-bold">
                Reminder Analytics
              </h2>

              <p className="text-gray-500 mt-2">
                Operational reminder metrics.
              </p>

            </div>

            <div className="h-[320px]">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={reminderBarData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="value"
                    radius={[8, 8, 0, 0]}
                    fill="#2563eb"
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* Activity Feed */}
      <Card className="border-0 shadow-md rounded-3xl">

        <CardContent className="p-8">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-2xl font-bold">
                Recent Activity
              </h2>

              <p className="text-gray-500 mt-2">
                Latest accounting workflow actions.
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2 text-blue-600 font-medium">

              View All

              <ArrowRight size={18} />

            </div>

          </div>

          <div className="space-y-4">

            {activities.length === 0 ? (

              <div className="text-center py-16">

                <p className="text-gray-500">
                  No recent activity yet.
                </p>

              </div>

            ) : (

              activities.map(
                (
                  activity,
                  index
                ) => (

                  <div
                    key={index}
                    className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-gray-50 transition"
                  >

                    <div>

                      <p className="font-semibold text-slate-900">

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

function AnalyticsCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    orange: "bg-orange-100 text-orange-500",
  };

  return (
    <Card className="border-0 shadow-md rounded-3xl">

      <CardContent className="p-7">

        <div className="flex items-start justify-between">

          <div>

            <p className="text-gray-500">
              {title}
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {value}
            </h2>

          </div>

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses[color]}`}
          >

            {icon}

          </div>

        </div>

      </CardContent>

    </Card>
  );
}