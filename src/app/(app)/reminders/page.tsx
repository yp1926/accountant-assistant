"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import {
  Bell,
  Search,
  Plus,
  Mail,
  Pencil,
  Trash2,
} from "lucide-react";

type Reminder = {
  id: number;
  client_id: number;
  client_name: string;
  client_email: string;
  message: string;
  due_date: string;
  status: string;
};

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export default function RemindersPage() {

  const supabase = createClient();

  const [reminders, setReminders] =
    useState<Reminder[]>([]);

  const [filteredReminders, setFilteredReminders] =
    useState<Reminder[]>([]);

  const [editingReminderId, setEditingReminderId] =
    useState<number | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [clients, setClients] =
    useState<Client[]>([]);

  const [filteredClients, setFilteredClients] =
    useState<Client[]>([]);

  const [selectedClientId, setSelectedClientId] =
    useState<number | null>(null);

  const [clientName, setClientName] =
    useState("");

  const [clientEmail, setClientEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const todayDate =
    new Date().toISOString().split("T")[0];

  async function fetchClients() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
      await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id);

    if (!error && data) {

      setClients(data);
    }
  }

  async function fetchReminders() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
      await supabase
        .from("reminders")
        .select(`
          *,
          clients (
            id,
            name,
            email
          )
        `)
        .eq("user_id", user?.id)
        .order("id", {
          ascending: false,
        });

    if (!error && data) {

      const formatted =
        data.map(
          (reminder: any) => ({
            ...reminder,
            client_name:
              reminder.clients?.name ||
              reminder.client_name,

            client_email:
              reminder.clients?.email ||
              reminder.client_email,
          })
        );

      setReminders(formatted);

      setFilteredReminders(formatted);
    }
  }

  useEffect(() => {

    fetchClients();

    fetchReminders();

  }, []);

  useEffect(() => {

    let filtered =
      reminders.filter(
        (reminder) =>

          reminder.client_name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          reminder.client_email
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          reminder.message
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

    if (statusFilter !== "all") {

      filtered =
        filtered.filter(
          (reminder) =>
            reminder.status ===
            statusFilter
        );
    }

    setFilteredReminders(filtered);

  }, [
    searchTerm,
    reminders,
    statusFilter,
  ]);

  function handleClientSearch(
    value: string
  ) {

    setClientName(value);

    if (
      value.length === 0
    ) {

      setFilteredClients([]);

      return;
    }

    const filtered =
      clients.filter(
        (client) =>
          client.name
            .toLowerCase()
            .includes(
              value.toLowerCase()
            )
      );

    setFilteredClients(filtered);
  }

  function selectClient(
    client: Client
  ) {

    setSelectedClientId(
      client.id
    );

    setClientName(
      client.name
    );

    setClientEmail(
      client.email
    );

    setFilteredClients([]);
  }

  async function handleAddReminder() {

    if (
      !clientName ||
      !clientEmail ||
      !message ||
      !dueDate
    ) {

      alert(
        "Please fill all fields."
      );

      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } =
      await supabase
        .from("reminders")
        .insert([
          {
            client_id:
              selectedClientId,
            client_name:
              clientName,
            client_email:
              clientEmail,
            message,
            due_date:
              dueDate,
            status: "pending",
            user_id:
              user?.id,
          },
        ]);

    if (error) {

      alert(error.message);

    } else {

      setSelectedClientId(null);

      setClientName("");

      setClientEmail("");

      setMessage("");

      setDueDate("");

      fetchReminders();
    }
  }

  async function handleDeleteReminder(
    id: number
  ) {

    const confirmed = confirm(
      "Delete reminder?"
    );

    if (!confirmed) return;

    await supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    fetchReminders();
  }

  async function handleSendEmail(
    id: number,
    clientName: string,
    clientEmail: string,
    message: string
  ) {

    const response =
      await fetch(
        "/api/send-reminder",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            to: clientEmail,
            subject:
              `Reminder for ${clientName}`,
            message,
          }),
        }
      );

    const result =
      await response.json();

    if (result.success) {

      await supabase
        .from("reminders")
        .update({
          status: "sent",
        })
        .eq("id", id);

      fetchReminders();

      alert("Email sent!");

    } else {

      alert(
        "Failed to send email"
      );
    }
  }

  function getPriorityColor(
    dueDate: string,
    status: string
  ) {

    if (status === "sent") {

      return "bg-green-600";
    }

    const today =
      new Date();

    const due =
      new Date(dueDate);

    const diffTime =
      due.getTime() -
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

      return "bg-red-600";
    }

    if (diffDays <= 7) {

      return "bg-yellow-500";
    }

    return "bg-green-600";
  }

  function getPriorityLabel(
    dueDate: string,
    status: string
  ) {

    if (status === "sent") {

      return "Sent";
    }

    const today =
      new Date();

    const due =
      new Date(dueDate);

    const diffTime =
      due.getTime() -
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

      return "Overdue";
    }

    if (diffDays <= 7) {

      return "Due Soon";
    }

    return "Upcoming";
  }

  return (
    <main className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

            Reminder Center

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">

                Reminders

              </h1>

              <p className="text-blue-100 mt-4 text-lg max-w-2xl leading-relaxed">

                Manage deadlines, client reminders and automated accounting notifications.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[220px]">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Bell size={28} />

                </div>

                <div>

                  <p className="text-blue-100 text-sm">
                    Total Reminders
                  </p>

                  <h2 className="text-4xl font-bold mt-1">

                    {reminders.length}

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Add Reminder */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

            <Plus size={24} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Add Reminder
            </h2>

            <p className="text-gray-500 mt-1">
              Create client reminder workflows.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="relative">

            <input
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) =>
                handleClientSearch(
                  e.target.value
                )
              }
            />

            {filteredClients.length > 0 && (

              <div className="absolute bg-white border border-gray-200 rounded-2xl w-full mt-2 z-20 shadow-lg overflow-hidden">

                {filteredClients.map(
                  (client) => (

                    <div
                      key={client.id}
                      onClick={() =>
                        selectClient(client)
                      }
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >

                      {client.name}

                    </div>

                  )
                )}

              </div>

            )}

          </div>

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Client Email"
            value={clientEmail}
            onChange={(e) =>
              setClientEmail(
                e.target.value
              )
            }
          />

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Reminder Message"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
          />

          <input
            type="date"
            min={todayDate}
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

        </div>

        <button
          onClick={handleAddReminder}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
        >

          Add Reminder

        </button>

      </div>

      {/* Reminder Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 overflow-hidden">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h2 className="text-2xl font-bold">
              Reminder List
            </h2>

            <p className="text-gray-500 mt-2">
              Monitor and manage client reminder workflows.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">

            <div className="relative w-full sm:w-80">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

            </div>

            <select
              className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="sent">
                Sent
              </option>

            </select>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b text-left">

                <th className="px-4 py-4 font-semibold">
                  Client
                </th>

                <th className="px-4 py-4 font-semibold">
                  Email
                </th>

                <th className="px-4 py-4 font-semibold">
                  Message
                </th>

                <th className="px-4 py-4 font-semibold">
                  Due Date
                </th>

                <th className="px-4 py-4 font-semibold">
                  Priority
                </th>

                <th className="px-4 py-4 font-semibold">
                  Status
                </th>

                <th className="px-4 py-4 font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReminders.map(
                (reminder) => (

                  <tr
                    key={reminder.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    <td className="px-4 py-5 font-semibold">

                      <Link
                        href={`/clients/${reminder.client_id}`}
                        className="text-blue-600 hover:underline"
                      >

                        {reminder.client_name}

                      </Link>

                    </td>

                    <td className="px-4 py-5">

                      {reminder.client_email}

                    </td>

                    <td className="px-4 py-5">

                      {reminder.message}

                    </td>

                    <td className="px-4 py-5">

                      {reminder.due_date}

                    </td>

                    <td className="px-4 py-5">

                      <span
                        className={`px-3 py-1 rounded-full text-sm text-white ${getPriorityColor(
                          reminder.due_date,
                          reminder.status
                        )}`}
                      >

                        {getPriorityLabel(
                          reminder.due_date,
                          reminder.status
                        )}

                      </span>

                    </td>

                    <td className="px-4 py-5 capitalize">

                      {reminder.status}

                    </td>

                    <td className="px-4 py-5">

                      <div className="flex flex-wrap gap-2">

                        <button
                          onClick={() =>
                            setEditingReminderId(
                              reminder.id
                            )
                          }
                          className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                        >

                          <Pencil size={16} />

                          Edit

                        </button>

                        <button
                          onClick={() =>
                            handleSendEmail(
                              reminder.id,
                              reminder.client_name,
                              reminder.client_email,
                              reminder.message
                            )
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                        >

                          <Mail size={16} />

                          Send

                        </button>

                        <button
                          onClick={() =>
                            handleDeleteReminder(
                              reminder.id
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                        >

                          <Trash2 size={16} />

                          Delete

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
}