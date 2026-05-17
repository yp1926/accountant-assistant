"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/client";

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

    const { data, error } = await supabase
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

    const { data, error } = await supabase
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

      const formattedReminders =
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

      setReminders(
        formattedReminders
      );

      setFilteredReminders(
        formattedReminders
      );
    }
  }

  useEffect(() => {

    fetchReminders();

    fetchClients();

  }, []);

  useEffect(() => {

    let filtered =
      reminders.filter(
        (reminder) =>

          reminder.client_name
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          reminder.client_email
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          reminder.message
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          reminder.status
            .toLowerCase()
            .startsWith(
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

    setFilteredReminders(
      filtered
    );

  }, [
    searchTerm,
    reminders,
    statusFilter,
  ]);

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

      console.error(
        result.error
      );
    }
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

    if (dueDate < todayDate) {

      alert(
        "Past dates are not allowed."
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

      alert(
        "Reminder added!"
      );

      setSelectedClientId(
        null
      );

      setClientName("");

      setClientEmail("");

      setMessage("");

      setDueDate("");

      setFilteredClients([]);

      fetchReminders();
    }
  }

  async function handleUpdateReminder(
    reminder: Reminder
  ) {

    if (
      reminder.due_date <
      todayDate
    ) {

      alert(
        "Past dates are not allowed."
      );

      return;
    }

    const { error } =
      await supabase
        .from("reminders")
        .update({
          message:
            reminder.message,
          due_date:
            reminder.due_date,
          status:
            reminder.status,
        })
        .eq("id", reminder.id);

    if (error) {

      alert(error.message);

    } else {

      alert(
        "Reminder updated!"
      );

      setEditingReminderId(
        null
      );

      fetchReminders();
    }
  }

  async function handleDeleteReminder(
    id: number
  ) {

    const confirmed =
      confirm(
        "Are you sure you want to delete this reminder?"
      );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("reminders")
        .delete()
        .eq("id", id);

    if (error) {

      alert(error.message);

    } else {

      alert(
        "Reminder deleted!"
      );

      fetchReminders();
    }
  }

  function handleReminderChange(
    id: number,
    field: keyof Reminder,
    value: string
  ) {

    setReminders(
      (
        prevReminders
      ) =>
        prevReminders.map(
          (reminder) =>
            reminder.id === id
              ? {
                  ...reminder,
                  [field]:
                    value,
                }
              : reminder
        )
    );
  }

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
            .startsWith(
              value.toLowerCase()
            )
      );

    setFilteredClients(
      filtered
    );
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

  function getDueDateColor(
    dueDate: string,
    status: string
  ) {

    if (status === "sent") {

      return "text-green-600 font-semibold";
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

      return "text-red-600 font-bold";
    }

    if (diffDays <= 7) {

      return "text-yellow-600 font-bold";
    }

    return "text-green-600 font-semibold";
  }

  function getDueDateLabel(
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
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Add Reminder */}
        <div className="bg-white p-8 rounded-lg shadow">

          <h1 className="text-3xl font-bold mb-6">
            Reminders
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="relative">

              <input
                required
                className="border p-3 rounded w-full"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) =>
                  handleClientSearch(
                    e.target.value
                  )
                }
              />

              {filteredClients.length >
                0 && (

                <div className="absolute bg-white border rounded w-full mt-1 z-10 shadow">

                  {filteredClients.map(
                    (client) => (

                      <div
                        key={
                          client.id
                        }
                        onClick={() =>
                          selectClient(
                            client
                          )
                        }
                        className="p-3 hover:bg-gray-100 cursor-pointer"
                      >
                        {
                          client.name
                        }
                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            <input
              required
              className="border p-3 rounded"
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) =>
                setClientEmail(
                  e.target.value
                )
              }
            />

            <input
              required
              className="border p-3 rounded"
              placeholder="Reminder Message"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
            />

            <input
              required
              type="date"
              min={todayDate}
              className="border p-3 rounded"
              value={dueDate}
              onChange={(e) =>
                setDueDate(
                  e.target.value
                )
              }
            />

          </div>

          <button
            onClick={
              handleAddReminder
            }
            className="mt-4 bg-black text-white px-6 py-3 rounded"
          >
            Add Reminder
          </button>

        </div>

        {/* Reminder List */}
        <div className="bg-white p-8 rounded-lg shadow overflow-x-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

            <h2 className="text-2xl font-bold">
              Reminder List
            </h2>

            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">

              <input
                className="border p-3 rounded w-full md:w-80"
                placeholder="Search reminders..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
              />

              <select
                className="border p-3 rounded"
                value={
                  statusFilter
                }
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

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b text-left">

                <th className="p-3">
                  Client
                </th>

                <th className="p-3">
                  Email
                </th>

                <th className="p-3">
                  Message
                </th>

                <th className="p-3">
                  Due Date
                </th>

                <th className="p-3">
                  Priority
                </th>

                <th className="p-3">
                  Status
                </th>

                <th className="p-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredReminders.map(
                (reminder) => (

                  <tr
                    key={
                      reminder.id
                    }
                    className="border-b"
                  >

                    {/* Client */}
                    <td className="p-3">

                      <Link
                        href={`/clients/${reminder.client_id}`}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        {
                          reminder.client_name
                        }
                      </Link>

                    </td>

                    {/* Email */}
                    <td className="p-3">
                      {
                        reminder.client_email
                      }
                    </td>

                    {/* Message */}
                    <td className="p-3">

                      {editingReminderId ===
                      reminder.id ? (

                        <input
                          className="border p-2 rounded w-full"
                          value={
                            reminder.message
                          }
                          onChange={(
                            e
                          ) =>
                            handleReminderChange(
                              reminder.id,
                              "message",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (
                        reminder.message
                      )}

                    </td>

                    {/* Due Date */}
                    <td className="p-3">

                      {editingReminderId ===
                      reminder.id ? (

                        <input
                          type="date"
                          min={
                            todayDate
                          }
                          className="border p-2 rounded w-full"
                          value={
                            reminder.due_date
                          }
                          onChange={(
                            e
                          ) =>
                            handleReminderChange(
                              reminder.id,
                              "due_date",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (

                        <span
                          className={getDueDateColor(
                            reminder.due_date,
                            reminder.status
                          )}
                        >
                          {
                            reminder.due_date
                          }
                        </span>

                      )}

                    </td>

                    {/* Priority */}
                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded text-sm text-white ${
                          getDueDateLabel(
                            reminder.due_date,
                            reminder.status
                          ) ===
                          "Overdue"
                            ? "bg-red-600"
                            : getDueDateLabel(
                                  reminder.due_date,
                                  reminder.status
                                ) ===
                              "Due Soon"
                            ? "bg-yellow-500"
                            : "bg-green-600"
                        }`}
                      >
                        {getDueDateLabel(
                          reminder.due_date,
                          reminder.status
                        )}
                      </span>

                    </td>

                    {/* Status */}
                    <td className="p-3">

                      {editingReminderId ===
                      reminder.id ? (

                        <select
                          className="border p-2 rounded"
                          value={
                            reminder.status
                          }
                          onChange={(
                            e
                          ) =>
                            handleReminderChange(
                              reminder.id,
                              "status",
                              e.target
                                .value
                            )
                          }
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="sent">
                            Sent
                          </option>

                        </select>

                      ) : (

                        <span className="capitalize">
                          {
                            reminder.status
                          }
                        </span>

                      )}

                    </td>

                    {/* Actions */}
                    <td className="p-3">

                      <div className="flex flex-col gap-2">

                        {editingReminderId ===
                        reminder.id ? (

                          <button
                            onClick={() =>
                              handleUpdateReminder(
                                reminder
                              )
                            }
                            className="bg-green-600 text-white px-3 py-2 rounded"
                          >
                            Save
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              setEditingReminderId(
                                reminder.id
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-2 rounded"
                          >
                            Edit
                          </button>

                        )}

                        <button
                          onClick={() =>
                            handleSendEmail(
                              reminder.id,
                              reminder.client_name,
                              reminder.client_email,
                              reminder.message
                            )
                          }
                          className="bg-black text-white px-3 py-2 rounded"
                        >
                          Send Email
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteReminder(
                              reminder.id
                            )
                          }
                          className="bg-red-600 text-white px-3 py-2 rounded"
                        >
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