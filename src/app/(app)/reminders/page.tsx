"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

type Reminder = {
  id: number;
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

  const [clients, setClients] =
    useState<Client[]>([]);

  const [filteredClients, setFilteredClients] =
    useState<Client[]>([]);

  const [clientName, setClientName] =
    useState("");

  const [clientEmail, setClientEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

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
      .select("*")
      .eq("user_id", user?.id)
      .order("id", { ascending: false });

    if (!error && data) {
      setReminders(data);
    }
  }

  useEffect(() => {
    fetchReminders();
    fetchClients();
  }, []);

  async function handleSendEmail(
    id: number,
    clientName: string,
    clientEmail: string,
    message: string
  ) {

    const response = await fetch(
      "/api/send-reminder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: clientEmail,
          subject: `Reminder for ${clientName}`,
          message,
        }),
      }
    );

    const result = await response.json();

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

      alert("Failed to send email");
      console.error(result.error);
    }
  }

  async function handleAddReminder() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("reminders")
      .insert([
        {
          client_name: clientName,
          client_email: clientEmail,
          message,
          due_date: dueDate,
          status: "pending",
          user_id: user?.id,
        },
      ]);

    if (error) {
      alert(error.message);
    } else {

      alert("Reminder added!");

      setClientName("");
      setClientEmail("");
      setMessage("");
      setDueDate("");
      setFilteredClients([]);

      fetchReminders();
    }
  }

  function handleClientSearch(value: string) {

    setClientName(value);

    if (value.length === 0) {
      setFilteredClients([]);
      return;
    }

    const filtered = clients.filter((client) =>
      client.name
        .toLowerCase()
        .includes(value.toLowerCase())
    );

    setFilteredClients(filtered);
  }

  function selectClient(client: Client) {

    setClientName(client.name);
    setClientEmail(client.email);

    setFilteredClients([]);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Add Reminder Form */}
        <div className="bg-white p-8 rounded-lg shadow">

          <h1 className="text-3xl font-bold mb-6">
            Reminders
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="relative">

              <input
                className="border p-3 rounded w-full"
                placeholder="Client Name"
                value={clientName}
                onChange={(e) =>
                  handleClientSearch(e.target.value)
                }
              />

              {filteredClients.length > 0 && (
                <div className="absolute bg-white border rounded w-full mt-1 z-10 shadow">

                  {filteredClients.map((client) => (
                    <div
                      key={client.id}
                      onClick={() =>
                        selectClient(client)
                      }
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {client.name}
                    </div>
                  ))}

                </div>
              )}

            </div>

            <input
              className="border p-3 rounded"
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) =>
                setClientEmail(e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Reminder Message"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
            />

            <input
              type="date"
              className="border p-3 rounded"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
            />

          </div>

          <button
            onClick={handleAddReminder}
            className="mt-4 bg-black text-white px-6 py-3 rounded"
          >
            Add Reminder
          </button>
        </div>

        {/* Reminder List */}
        <div className="bg-white p-8 rounded-lg shadow overflow-x-auto">

          <h2 className="text-2xl font-bold mb-6">
            Reminder List
          </h2>

          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Client</th>
                <th className="p-3">Email</th>
                <th className="p-3">Message</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reminders.map((reminder) => (
                <tr
                  key={reminder.id}
                  className="border-b"
                >
                  <td className="p-3">
                    {reminder.client_name}
                  </td>

                  <td className="p-3">
                    {reminder.client_email}
                  </td>

                  <td className="p-3">
                    {reminder.message}
                  </td>

                  <td className="p-3">
                    {reminder.due_date}
                  </td>

                  <td className="p-3 capitalize">
                    {reminder.status}
                  </td>

                  <td className="p-3">

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

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}