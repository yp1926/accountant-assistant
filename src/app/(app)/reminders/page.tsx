"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { createClient } from "@/lib/client";

import {
  Bell,
  Search,
  Plus,
  Mail,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

type Reminder = {
  id: number;
  client_id: number;
  client_name: string;
  client_email: string;
  client_company: string;
  message: string;
  due_date: string;
  status: string;
  frequency: string;
  sent_count?: number;
  last_sent_at?: string;
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
  
  const [selectedReminders, setSelectedReminders] =
    useState<number[]>([]);
  
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

  const [frequency, setFrequency] =
    useState("once");

  const [addingReminder, setAddingReminder] =
    useState(false);

  const [sendingReminderId, setSendingReminderId] =
    useState<number | null>(null);

  const [sortField, setSortField] =
    useState<
      | "client"
      | "due_date"
      | "priority"
      | "status"
    >("due_date");

  const [sortDirection, setSortDirection] =
    useState<
      "asc" | "desc"
    >("asc");

  const [showMessageModal, setShowMessageModal] =
    useState(false);

  const [viewMode, setViewMode] =
    useState<
      "table" | "calendar"
    >("table");


  const todayDate =
    new Date().toISOString().split("T")[0];

    const reminderTemplates = [
      {
        label: "VAT Reminder",
        message:
          "Hello, this is a reminder that your VAT filing deadline is approaching. Please ensure all required documents are submitted on time.",
      },
    
      {
        label: "Tax Filing",
        message:
          "Hello, this is a reminder regarding your upcoming tax filing deadline. Please review and prepare all necessary financial information.",
      },
    
      {
        label: "Invoice Payment",
        message:
          "Hello, this is a reminder about your pending invoice payment. Please process the payment at your earliest convenience.",
      },
    
      {
        label: "Missing Documents",
        message:
          "Hello, please send the missing accounting documents required to complete your file processing.",
      },
    
      {
        label: "Payroll Deadline",
        message:
          "Hello, this is a reminder regarding the upcoming payroll processing deadline.",
      },
    ];

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
            email,
            company
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

            client_company:
              reminder.clients?.company ||
              "",
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

      toast.error(
        "Please fill all fields."
      );

      return;
    }

    setAddingReminder(true);

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
            frequency,
            user_id:
              user?.id,
          },
        ]);

    if (error) {

      setAddingReminder(false);

      toast.error(
        error.message
      );

      return;
    }

    setSelectedClientId(null);

    setClientName("");

    setClientEmail("");

    setMessage("");

    setDueDate("");

    setFrequency("once");

    fetchReminders();

    setAddingReminder(false);

    toast.success(
      "Reminder added successfully!"
    );
  }

  async function handleUpdateReminder(
    reminder: Reminder
  ) {

    const { error } =
      await supabase
        .from("reminders")
        .update({
          client_name:
            reminder.client_name,

          client_email:
            reminder.client_email,

          message:
            reminder.message,

          due_date:
            reminder.due_date,

          frequency:
            reminder.frequency,
        })
        .eq(
          "id",
          reminder.id
        );

    if (error) {

      toast.error(
        error.message
      );

      return;
    }

    setEditingReminderId(null);

    fetchReminders();

    toast.success(
      "Reminder updated successfully!"
    );
  }

  function handleReminderChange(
    id: number,
    field: keyof Reminder,
    value: string
  ) {
  
    setReminders(
      (prevReminders) =>
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
  
  function toggleReminderSelection(
    id: number
  ) {
  
    setSelectedReminders(
      (prev) =>
  
        prev.includes(id)
  
          ? prev.filter(
              (item) =>
                item !== id
            )
  
          : [...prev, id]
    );
  }

  async function handleDeleteReminder(
    id: number
  ) {

    await supabase
      .from("reminders")
      .delete()
      .eq("id", id);

    fetchReminders();

    toast.success(
      "Reminder deleted successfully!"
    );
  }

  async function handleCompleteReminder(
    reminder: Reminder
  ) {

    if (
      reminder.frequency &&
      reminder.frequency !== "once"
    ) {

      const nextDate =
        new Date(
          reminder.due_date
        );

      switch (
        reminder.frequency
      ) {

        case "weekly":

          nextDate.setDate(
            nextDate.getDate() + 7
          );

          break;

        case "monthly":

          nextDate.setMonth(
            nextDate.getMonth() + 1
          );

          break;

        case "quarterly":

          nextDate.setMonth(
            nextDate.getMonth() + 3
          );

          break;

        case "yearly":

          nextDate.setFullYear(
            nextDate.getFullYear() + 1
          );

          break;
      }

      await supabase
        .from("reminders")
        .update({
          due_date:
            nextDate
              .toISOString()
              .split("T")[0],

          status:
            "pending",

          completed_at:
            new Date()
              .toISOString(),

          reminder_7_sent:
            false,

          reminder_1_sent:
            false,

          due_reminder_sent:
            false,
        })
        .eq(
          "id",
          reminder.id
        );

      toast.success(
        "Recurring reminder completed and regenerated!"
      );

    } else {

      await supabase
        .from("reminders")
        .update({
          status:
            "completed",

          completed_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          reminder.id
        );

      toast.success(
        "Reminder completed successfully!"
      );
    }

    fetchReminders();
  }

  async function handleSendEmail(
    id: number,
    clientName: string,
    clientEmail: string,
    message: string
  ) {

    setSendingReminderId(id);

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

      const reminder =
  reminders.find(
    (r) =>
      r.id === id
  );

      await supabase
        .from("reminders")
        .update({
          status: "sent",

          sent_count:
            (reminder
              ?.sent_count || 0) + 1,

          last_sent_at:
            new Date()
              .toISOString(),
        })
        .eq("id", id);

      fetchReminders();

      setSendingReminderId(null);

      toast.success(
        "Reminder email sent successfully!"
      );

    } else {

      setSendingReminderId(null);

      toast.error(
        "Failed to send reminder email."
      );
    }
  }

  async function handleBulkSend() {

    if (
      selectedReminders.length ===
      0
    ) {
  
      toast.error(
        "Select reminders first."
      );
  
      return;
    }
  
    try {
  
      for (const id of selectedReminders) {
  
        const reminder =
          reminders.find(
            (r) =>
              r.id === id
          );
  
        if (
          !reminder
        ) {
  
          continue;
        }
  
        if (
          reminder.status ===
          "completed"
        ) {
  
          continue;
        }
  
        await handleSendEmail(
          reminder.id,
          reminder.client_name,
          reminder.client_email,
          reminder.message
        );
      }
  
      setSelectedReminders(
        []
      );
  
      toast.success(
        "Selected reminders sent successfully!"
      );
  
    } catch (error) {
  
      console.error(
        error
      );
  
      toast.error(
        "Failed to send selected reminders."
      );
    }
  }

  function getPriorityColor(
    dueDate: string,
    status: string
  ) {

    if (
      status === "completed"
    ) {

      return "bg-emerald-600";
    }

    if (
      status === "sent"
    ) {

      return "bg-blue-600";
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

    if (
      status === "completed"
    ) {

      return "Completed";
    }

    if (
      status === "sent"
    ) {

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

  function getPriorityRank(
    dueDate: string,
    status: string
  ) {
  
    const today =
      new Date();
  
    const due =
      new Date(dueDate);
  
    const diff =
      due.getTime() -
      today.getTime();
  
    const daysLeft =
      Math.ceil(
        diff /
          (1000 * 60 * 60 * 24)
      );
  
    if (
      status ===
      "completed"
    ) {
  
      return 4;
    }
  
    if (daysLeft < 0) {
  
      return 1;
    }
  
    if (daysLeft <= 7) {
  
      return 2;
    }
  
    return 3;
  }

  function getLastActionLabel(
    reminder: Reminder
  ) {
  
    if (
      !reminder.last_sent_at
    ) {
  
      return "Never Sent";
    }
  
    const now =
      new Date();
  
    const sentDate =
      new Date(
        reminder.last_sent_at
      );
  
    const diffTime =
      now.getTime() -
      sentDate.getTime();
  
    const diffDays =
      Math.floor(
        diffTime /
          (
            1000 *
            60 *
            60 *
            24
          )
      );
  
    if (
      diffDays === 0
    ) {
  
      return "Sent Today";
    }
  
    if (
      diffDays === 1
    ) {
  
      return "Sent Yesterday";
    }
  
    return `Sent ${diffDays} days ago`;
  }

  function handleSort(
    field:
      | "client"
      | "due_date"
      | "priority"
      | "status"
  ) {
  
    let direction:
      | "asc"
      | "desc" = "asc";
  
    if (
      sortField === field &&
      sortDirection === "asc"
    ) {
  
      direction = "desc";
    }
  
    setSortField(field);
  
    setSortDirection(
      direction
    );
  
    const filtered =
      reminders.filter(
        (reminder) => {
  
          const matchesSearch =
  
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
              );
  
          const matchesStatus =
  
            statusFilter ===
              "all" ||
  
            reminder.status ===
              statusFilter;
  
          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
  
    const sorted =
      [...filtered].sort(
        (a, b) => {
  
          switch (field) {
  
            case "client": {
  
              const result =
                a.client_name.localeCompare(
                  b.client_name
                );
  
              return direction ===
                "asc"
                ? result
                : -result;
            }
  
            case "status": {
  
              const result =
                a.status.localeCompare(
                  b.status
                );
  
              return direction ===
                "asc"
                ? result
                : -result;
            }
  
            case "due_date": {
  
              const result =
                new Date(
                  a.due_date
                ).getTime() -
                new Date(
                  b.due_date
                ).getTime();
  
              return direction ===
                "asc"
                ? result
                : -result;
            }
  
            case "priority": {
  
              const result =
                getPriorityRank(
                  a.due_date,
                  a.status
                ) -
                getPriorityRank(
                  b.due_date,
                  b.status
                );
  
              return direction ===
                "asc"
                ? result
                : -result;
            }
  
            default:
  
              return 0;
          }
        }
      );
  
    setFilteredReminders(
      sorted
    );
  }

  return (
    <main className="space-y-8">

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

                Manage accounting workflows, recurring deadlines and operational reminder automation.

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

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

            <Plus size={24} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Add Reminder
            </h2>

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

            <button
              type="button"
              onClick={() =>
                setShowMessageModal(true)
              }
              className="border border-gray-300 rounded-2xl px-4 py-3 text-left hover:border-blue-500 transition"
            >

              {message || "Reminder Message"}

            </button>

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

          <select
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={frequency}
            onChange={(e) =>
              setFrequency(
                e.target.value
              )
            }
          >

            <option value="once">
              Once
            </option>

            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="quarterly">
              Quarterly
            </option>

            <option value="yearly">
              Yearly
            </option>

          </select>

        </div>

        <button
          onClick={handleAddReminder}
          disabled={addingReminder}
          className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition"
        >

          {addingReminder
            ? "Adding Reminder..."
            : "Add Reminder"}

        </button>

      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 overflow-hidden">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex flex-wrap items-center gap-4">

              <h2 className="text-2xl font-bold">

                Reminder Workflows

              </h2>

              {selectedReminders.length > 0 && (

                <div className="flex flex-wrap items-center gap-3">

                  <button
                    onClick={
                      handleBulkSend
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl transition"
                  >

                    Send Selected (
                    {selectedReminders.length}
                    )

                  </button>

                  <button
                    onClick={() =>
                      setSelectedReminders([])
                    }
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-3 rounded-2xl transition"
                  >

                    Clear Selection

                  </button>

                </div>

              )}

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setViewMode(
                    "table"
                  )
                }
                className={`px-5 py-2 rounded-2xl transition ${
                  viewMode ===
                  "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >

                Table View

              </button>

              <button
                onClick={() =>
                  setViewMode(
                    "calendar"
                  )
                }
                className={`px-5 py-2 rounded-2xl transition ${
                  viewMode ===
                  "calendar"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >

                Calendar View

              </button>

            </div>

          </div>

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

              <option value="completed">
                Completed
              </option>

            </select>

          </div>

        </div>

        {filteredReminders.length === 0 ? (

          <div className="text-center py-16">

            <Bell
              size={52}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-5 text-xl font-semibold text-slate-800">

              No reminders found

            </h3>

            <p className="text-gray-500 mt-2">

              Create reminder workflows to automate accounting operations.

            </p>

          </div>

          ) : viewMode === "table" ? (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1300px]">

            <thead>

              <tr className="border-b text-left">

                <th className="px-4 py-4">

                </th>

                <th className="px-4 py-4 font-semibold">

                  <button
                    onClick={() =>
                      handleSort("client")
                    }
                    className="hover:text-blue-600 transition"
                  >

                    Client

                  </button>

                </th>

                  <th className="px-4 py-4 font-semibold">
                    Email
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Message
                  </th>

                  <th className="px-4 py-4 font-semibold">

                      <button
                        onClick={() =>
                          handleSort(
                            "due_date"
                          )
                        }
                        className="hover:text-blue-600 transition"
                      >

                        Due Date

                      </button>

                    </th>

                  <th className="px-4 py-4 font-semibold">
                    Frequency
                  </th>

                  <th className="px-4 py-4 font-semibold">

                      <button
                        onClick={() =>
                          handleSort(
                            "priority"
                          )
                        }
                        className="hover:text-blue-600 transition"
                      >

                        Priority

                      </button>

                    </th>

                    <th className="px-4 py-4 font-semibold">

                      <button
                        onClick={() =>
                          handleSort(
                            "status"
                          )
                        }
                        className="hover:text-blue-600 transition"
                      >

                        Status

                      </button>

                    </th>

                    <th className="py-4 px-4 font-semibold text-slate-700">

                      Activity

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

                      <td className="px-4 py-5">

                      <input
                        type="checkbox"
                        checked={selectedReminders.includes(
                          reminder.id
                        )}
                        onChange={() =>
                          toggleReminderSelection(
                            reminder.id
                          )
                        }
                        className="w-4 h-4"
                      />

                      </td>

                      <td className="px-4 py-5 font-semibold">

                        {editingReminderId === reminder.id ? (

                          <input
                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                            value={reminder.client_name}
                            onChange={(e) =>
                              handleReminderChange(
                                reminder.id,
                                "client_name",
                                e.target.value
                              )
                            }
                          />

                        ) : (

                          <div>

                            <Link
                              href={`/clients/${reminder.client_id}`}
                              className="text-blue-600 hover:underline font-semibold"
                            >

                              {reminder.client_name}

                            </Link>

                            <p className="text-sm text-gray-500 mt-1">

                              {reminder.client_company ===
                              "Individual"
                                ? "Individual Client"
                                : reminder.client_company}

                            </p>

                          </div>

                        )}

                      </td>

                      <td className="px-4 py-5">

                        {reminder.client_email}

                      </td>

                      <td className="px-4 py-5">

                        {editingReminderId === reminder.id ? (

                          <input
                            className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                            value={reminder.message}
                            onChange={(e) =>
                              handleReminderChange(
                                reminder.id,
                                "message",
                                e.target.value
                              )
                            }
                          />

                        ) : (

                          reminder.message

                        )}

                      </td>

                      <td className="px-4 py-5">

                        {editingReminderId === reminder.id ? (

                          <input
                            type="date"
                            className="border border-gray-300 rounded-xl px-3 py-2"
                            value={reminder.due_date}
                            onChange={(e) =>
                              handleReminderChange(
                                reminder.id,
                                "due_date",
                                e.target.value
                              )
                            }
                          />

                        ) : (

                          reminder.due_date

                        )}

                      </td>

                      <td className="px-4 py-5 capitalize">

                        {editingReminderId === reminder.id ? (

                          <select
                            className="border border-gray-300 rounded-xl px-3 py-2"
                            value={reminder.frequency}
                            onChange={(e) =>
                              handleReminderChange(
                                reminder.id,
                                "frequency",
                                e.target.value
                              )
                            }
                          >

                            <option value="once">
                              Once
                            </option>

                            <option value="weekly">
                              Weekly
                            </option>

                            <option value="monthly">
                              Monthly
                            </option>

                            <option value="quarterly">
                              Quarterly
                            </option>

                            <option value="yearly">
                              Yearly
                            </option>

                          </select>

                        ) : (

                          reminder.frequency || "once"

                        )}

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

                      <td className="px-4 py-5 text-sm text-gray-600">

                        <div className="space-y-1">

                          <div>

                            Sent{" "}
                            <span className="font-semibold">

                              {reminder.sent_count || 0}

                            </span>{" "}
                            times

                            </div>

                            <div className="text-xs font-medium text-blue-600">

                            {getLastActionLabel(
                              reminder
                            )}

                            </div>

                          {reminder.last_sent_at && (

                            <div className="text-xs text-gray-500">

                              Last sent:{" "}
                              {new Date(
                                reminder.last_sent_at
                              ).toLocaleDateString()}

                            </div>

                          )}

                        </div>

                      </td>

                      <td className="px-4 py-5 capitalize font-medium">

                        {reminder.status}

                      </td>

                      <td className="px-4 py-5">

                        <div className="flex flex-wrap gap-2">

                          {reminder.status !== "completed" && (

                            <ConfirmDialog
                              title="Complete Reminder"
                              description="Mark this reminder as completed?"
                              confirmText="Complete"
                              onConfirm={() =>
                                handleCompleteReminder(
                                  reminder
                                )
                              }
                            >

                              <button
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                              >

                                <CheckCircle2 size={16} />

                                Complete

                              </button>

                            </ConfirmDialog>

                          )}

                          {reminder.status === "pending" && (

                            <button
                              onClick={() =>
                                handleSendEmail(
                                  reminder.id,
                                  reminder.client_name,
                                  reminder.client_email,
                                  reminder.message
                                )
                              }
                              disabled={
                                sendingReminderId ===
                                reminder.id
                              }
                              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                            >

                              <Mail size={16} />

                              {sendingReminderId === reminder.id
                                ? "Sending..."
                                : "Send"}

                            </button>

                          )}

                          {editingReminderId === reminder.id ? (

                            <button
                              onClick={() =>
                                handleUpdateReminder(
                                  reminder
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
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
                              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                            >

                              <Pencil size={16} />

                              Edit

                            </button>

                          )}

                          <ConfirmDialog
                            title="Delete Reminder"
                            description="This reminder will be permanently deleted."
                            confirmText="Delete"
                            onConfirm={() =>
                              handleDeleteReminder(
                                reminder.id
                              )
                            }
                          >

                            <button
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                            >

                              <Trash2 size={16} />

                              Delete

                            </button>

                          </ConfirmDialog>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

              </table>

            </div>

            ) : (

              <div className="bg-white border border-gray-200 rounded-3xl p-6">

                <div className="flex items-center justify-between mb-8">

                  <h3 className="text-2xl font-bold text-slate-800">

                    Reminder Calendar

                  </h3>

                  <div className="text-sm text-gray-500">

                    {new Date().toLocaleString(
                      "default",
                      {
                        month: "long",
                        year: "numeric",
                      }
                    )}

                  </div>

                </div>

                <div className="grid grid-cols-7 gap-3 mb-4">

                  {[
                    "Sun",
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                  ].map((day) => (

                    <div
                      key={day}
                      className="text-center text-sm font-semibold text-gray-500 py-2"
                    >

                      {day}

                    </div>

                  ))}

                </div>

                <div className="grid grid-cols-7 gap-3">

                {Array.from({
                  length: 35,
                }).map((_, index) => {

                  const day =
                    index + 1;

                  const dayReminders =
                    filteredReminders.filter(
                      (reminder) => {

                        const reminderDate =
                          new Date(
                            reminder.due_date
                          );

                        return (
                          reminderDate.getDate() ===
                          day
                        );
                      }
                    );

                  return (

                    <div
                      key={index}
                      className="border border-gray-200 rounded-2xl min-h-[140px] p-3 hover:border-blue-400 transition bg-gray-50 overflow-hidden"
                    >

                      <div className="text-sm font-semibold text-gray-700 mb-3">

                        {day <= 31
                          ? day
                          : ""}

                      </div>

                      <div className="space-y-2">

                        {dayReminders
                          .slice(0, 3)
                          .map(
                            (reminder) => (

                              <div
                                key={reminder.id}
                                className={`text-xs rounded-xl px-2 py-2 text-white truncate ${
                                  reminder.status ===
                                  "completed"
                                    ? "bg-green-600"

                                    : getPriorityLabel(
                                        reminder.due_date,
                                        reminder.status
                                      ) ===
                                      "Overdue"
                                    ? "bg-red-600"

                                    : getPriorityLabel(
                                        reminder.due_date,
                                        reminder.status
                                      ) ===
                                      "Due Soon"
                                    ? "bg-yellow-500"

                                    : "bg-blue-600"
                                }`}
                              >

                                {
                                  reminder.client_name
                                }

                              </div>

                            )
                          )}

                        {dayReminders.length >
                          3 && (

                          <div className="text-xs text-gray-500 font-medium">

                            +
                            {dayReminders.length -
                              3}{" "}
                            more

                          </div>

                        )}

                      </div>

                    </div>

                  );
                })}

                </div>

              </div>

              )}

      </div>

      {showMessageModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-6 space-y-6">

    <div className="flex items-center justify-between">

      <h2 className="text-2xl font-bold">

        Reminder Message

      </h2>

      <button
        onClick={() =>
          setShowMessageModal(false)
        }
        className="text-gray-500 hover:text-black"
      >

        ✕

      </button>

    </div>

    <div className="space-y-3">

      <p className="text-sm font-medium text-gray-600">

        Quick Templates

      </p>

      <div className="flex flex-wrap gap-3">

        {reminderTemplates.map(
          (template) => (

            <button
              key={template.label}
              type="button"
              onClick={() =>
                setMessage(
                  template.message
                )
              }
              className="px-4 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium"
            >

              {template.label}

            </button>

          )
        )}

      </div>

    </div>

    <textarea
      value={message}
      onChange={(e) =>
        setMessage(
          e.target.value
        )
      }
      rows={8}
      className="w-full border border-gray-300 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      placeholder="Write reminder message..."
    />

      <div className="flex justify-between items-center gap-3">

      <button
        type="button"
        onClick={() =>
          setMessage("")
        }
        className="px-5 py-3 rounded-2xl bg-red-100 hover:bg-red-200 text-red-700 transition"
      >

        Clear Message

      </button>

      <div className="flex gap-3">

        <button
          onClick={() =>
            setShowMessageModal(false)
          }
          className="px-5 py-3 rounded-2xl bg-gray-200 hover:bg-gray-300 transition"
        >

          Cancel

        </button>

        <button
          onClick={() =>
            setShowMessageModal(false)
          }
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition"
        >

          Save Message

        </button>

      </div>

      </div>

  </div>

</div>

)}

    </main>
  );
}