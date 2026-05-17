"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

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

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  async function fetchClients() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
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
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          client.email
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          client.company
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            )
      );

    setFilteredClients(filtered);

  }, [searchTerm, clients]);

  async function handleAddClient() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
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

      alert("Client added!");

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

    const { error } = await supabase
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

      alert("Client updated!");

      setEditingClientId(null);

      fetchClients();
    }
  }

  async function handleDeleteClient(
    id: number
  ) {

    const confirmed = confirm(
      "Are you sure you want to delete this client?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) {

      alert(
        "Cannot delete client with existing reminders."
      );

      console.log(
        "Delete blocked by relational protection."
      );

    } else {

      alert("Client deleted!");

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
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto space-y-8">

        {/* Add Client Form */}
        <div className="bg-white p-8 rounded-lg shadow">

          <h1 className="text-3xl font-bold mb-6">
            Clients
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              className="border p-3 rounded"
              placeholder="Client Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
            />

            <input
              className="border p-3 rounded"
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
            onClick={
              handleAddClient
            }
            className="mt-4 bg-black text-white px-6 py-3 rounded"
          >
            Add Client
          </button>

        </div>

        {/* Client List */}
        <div className="bg-white p-8 rounded-lg shadow overflow-x-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

            <h2 className="text-2xl font-bold">
              Client List
            </h2>

            <input
              className="border p-3 rounded w-full md:w-80"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

          <table className="w-full border-collapse">

            <thead>

              <tr className="border-b text-left">

                <th className="p-3">
                  Name
                </th>

                <th className="p-3">
                  Email
                </th>

                <th className="p-3">
                  Phone
                </th>

                <th className="p-3">
                  Company
                </th>

                <th className="p-3">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredClients.map(
                (client) => (

                  <tr
                    key={
                      client.id
                    }
                    className="border-b"
                  >

                    {/* Name */}
                    <td className="p-3">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border p-2 rounded w-full"
                          value={
                            client.name
                          }
                          onChange={(
                            e
                          ) =>
                            handleClientChange(
                              client.id,
                              "name",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (

                        <Link
                          href={`/clients/${client.id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {
                            client.name
                          }
                        </Link>

                      )}

                    </td>

                    {/* Email */}
                    <td className="p-3">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border p-2 rounded w-full"
                          value={
                            client.email
                          }
                          onChange={(
                            e
                          ) =>
                            handleClientChange(
                              client.id,
                              "email",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (
                        client.email
                      )}

                    </td>

                    {/* Phone */}
                    <td className="p-3">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border p-2 rounded w-full"
                          value={
                            client.phone
                          }
                          onChange={(
                            e
                          ) =>
                            handleClientChange(
                              client.id,
                              "phone",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (
                        client.phone
                      )}

                    </td>

                    {/* Company */}
                    <td className="p-3">

                      {editingClientId ===
                      client.id ? (

                        <input
                          className="border p-2 rounded w-full"
                          value={
                            client.company
                          }
                          onChange={(
                            e
                          ) =>
                            handleClientChange(
                              client.id,
                              "company",
                              e.target
                                .value
                            )
                          }
                        />

                      ) : (
                        client.company
                      )}

                    </td>

                    {/* Actions */}
                    <td className="p-3">

                      {editingClientId ===
                      client.id ? (

                        <button
                          onClick={() =>
                            handleUpdateClient(
                              client
                            )
                          }
                          className="bg-green-600 text-white px-3 py-2 rounded"
                        >
                          Save
                        </button>

                      ) : (

                        <div className="flex flex-col gap-2">

                          <button
                            onClick={() =>
                              setEditingClientId(
                                client.id
                              )
                            }
                            className="bg-black text-white px-3 py-2 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteClient(
                                client.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-2 rounded"
                          >
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