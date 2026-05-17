"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import {
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

export default function ClientsPage() {

  const supabase = createClient();

  const [clients, setClients] =
    useState<Client[]>([]);

  const [filteredClients, setFilteredClients] =
    useState<Client[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [editingClientId, setEditingClientId] =
    useState<number | null>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [company, setCompany] =
    useState("");

  async function fetchClients() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
      await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .order("id", {
          ascending: false,
        });

    if (!error && data) {

      setClients(data);

      setFilteredClients(data);
    }
  }

  useEffect(() => {

    fetchClients();

  }, []);

  useEffect(() => {

    const filtered =
      clients.filter(
        (client) =>

          client.name
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          client.email
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            ) ||

          client.company
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

    setFilteredClients(filtered);

  }, [searchTerm, clients]);

  async function handleAddClient() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } =
      await supabase
        .from("clients")
        .insert([
          {
            name,
            email,
            phone,
            company,
            user_id: user?.id,
          },
        ]);

    if (error) {

      alert(error.message);

    } else {

      setName("");

      setEmail("");

      setPhone("");

      setCompany("");

      fetchClients();
    }
  }

  async function handleUpdateClient(
    client: Client
  ) {

    const { error } =
      await supabase
        .from("clients")
        .update({
          name: client.name,
          email: client.email,
          phone: client.phone,
          company: client.company,
        })
        .eq("id", client.id);

    if (error) {

      alert(error.message);

    } else {

      setEditingClientId(null);

      fetchClients();
    }
  }

  async function handleDeleteClient(
    id: number
  ) {

    const confirmed = confirm(
      "Delete this client?"
    );

    if (!confirmed) return;

    const { error } =
      await supabase
        .from("clients")
        .delete()
        .eq("id", id);

    if (error) {

      alert(
        "Cannot delete client with reminders."
      );

    } else {

      fetchClients();
    }
  }

  function handleClientChange(
    id: number,
    field: keyof Client,
    value: string
  ) {

    setClients(
      (prevClients) =>
        prevClients.map(
          (client) =>
            client.id === id
              ? {
                  ...client,
                  [field]:
                    value,
                }
              : client
        )
    );
  }

  return (
    <main className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

            Client Management

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">

                Clients

              </h1>

              <p className="text-blue-100 mt-4 text-lg max-w-2xl leading-relaxed">

                Manage accounting clients, business information
                and contact details from one centralized workspace.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[220px]">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Users size={28} />

                </div>

                <div>

                  <p className="text-blue-100 text-sm">
                    Total Clients
                  </p>

                  <h2 className="text-4xl font-bold mt-1">

                    {clients.length}

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Add Client */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

            <Plus size={24} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Add Client
            </h2>

            <p className="text-gray-500 mt-1">
              Create a new client profile.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Client Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <input
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company"
            value={company}
            onChange={(e) =>
              setCompany(
                e.target.value
              )
            }
          />

        </div>

        <button
          onClick={handleAddClient}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition"
        >

          Add Client

        </button>

      </div>

      {/* Client Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 overflow-hidden">

        {/* Top */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h2 className="text-2xl font-bold">
              Client List
            </h2>

            <p className="text-gray-500 mt-2">
              Browse and manage your accounting clients.
            </p>

          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>

              <tr className="border-b text-left">

                <th className="py-4 px-4 font-semibold text-slate-700">

                  Name

                </th>

                <th className="py-4 px-4 font-semibold text-slate-700">

                  Email

                </th>

                <th className="py-4 px-4 font-semibold text-slate-700">

                  Phone

                </th>

                <th className="py-4 px-4 font-semibold text-slate-700">

                  Company

                </th>

                <th className="py-4 px-4 font-semibold text-slate-700">

                  Actions

                </th>

              </tr>

            </thead>

            <tbody>

              {filteredClients.map(
                (client) => (

                  <tr
                    key={client.id}
                    className="border-b hover:bg-gray-50 transition"
                  >

                    {/* Name */}
                    <td className="px-4 py-5">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                          value={client.name}
                          onChange={(e) =>
                            handleClientChange(
                              client.id,
                              "name",
                              e.target.value
                            )
                          }
                        />

                      ) : (

                        <Link
                          href={`/clients/${client.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >

                          {client.name}

                        </Link>

                      )}

                    </td>

                    {/* Email */}
                    <td className="px-4 py-5">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                          value={client.email}
                          onChange={(e) =>
                            handleClientChange(
                              client.id,
                              "email",
                              e.target.value
                            )
                          }
                        />

                      ) : (
                        client.email
                      )}

                    </td>

                    {/* Phone */}
                    <td className="px-4 py-5">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                          value={client.phone}
                          onChange={(e) =>
                            handleClientChange(
                              client.id,
                              "phone",
                              e.target.value
                            )
                          }
                        />

                      ) : (
                        client.phone
                      )}

                    </td>

                    {/* Company */}
                    <td className="px-4 py-5">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border border-gray-300 rounded-xl px-3 py-2 w-full"
                          value={client.company}
                          onChange={(e) =>
                            handleClientChange(
                              client.id,
                              "company",
                              e.target.value
                            )
                          }
                        />

                      ) : (
                        client.company
                      )}

                    </td>

                    {/* Actions */}
                    <td className="px-4 py-5">

                      {editingClientId ===
                      client.id ? (

                        <button
                          onClick={() =>
                            handleUpdateClient(
                              client
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium transition"
                        >

                          Save

                        </button>

                      ) : (

                        <div className="flex items-center gap-3">

                          <button
                            onClick={() =>
                              setEditingClientId(
                                client.id
                              )
                            }
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                          >

                            <Pencil size={16} />

                            Edit

                          </button>

                          <button
                            onClick={() =>
                              handleDeleteClient(
                                client.id
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                          >

                            <Trash2 size={16} />

                            Delete

                          </button>

                        </div>

                      )}

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