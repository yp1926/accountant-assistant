"use client";

import { useEffect, useState } from "react";
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

  const [clients, setClients] = useState<Client[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");

  async function fetchClients() {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setClients(data);
    }
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleAddClient() {
    const { error } = await supabase
      .from("clients")
      .insert([
        {
          name,
          email,
          phone,
          company,
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
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />

          </div>

          <button
            onClick={handleAddClient}
            className="mt-4 bg-black text-white px-6 py-3 rounded"
          >
            Add Client
          </button>
        </div>

        {/* Clients Table */}
        <div className="bg-white p-8 rounded-lg shadow overflow-x-auto">

          <h2 className="text-2xl font-bold mb-6">
            Client List
          </h2>

          <table className="w-full border-collapse">

            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Company</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b"
                >
                  <td className="p-3">{client.name}</td>
                  <td className="p-3">{client.email}</td>
                  <td className="p-3">{client.phone}</td>
                  <td className="p-3">{client.company}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}