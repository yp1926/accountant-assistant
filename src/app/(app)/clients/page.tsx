"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import * as XLSX from "xlsx";

import ConfirmDialog from "@/components/ui/ConfirmDialog";

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

  const [isCompany, setIsCompany] =
    useState(true);

  const [addingClient, setAddingClient] =
    useState(false);

  const [importingClients, setImportingClients] =
    useState(false);

  const [sortField, setSortField] =
    useState<
      "name" | "company"
    >("name");

  const [sortDirection, setSortDirection] =
    useState<
      "asc" | "desc"
    >("asc");

  async function fetchClients() {

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user?.id)
        .single();
    
    const { data, error } =
      await supabase
        .from("clients")
        .select("*")
        .eq(
          "workspace_id",
          profile?.workspace_id
        )
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
            )
      );

    setFilteredClients(
      filtered
    );

  }, [searchTerm, clients]);

  async function handleAddClient() {

    if (
      !name ||
      !email
    ) {

      toast.error(
        "Name and email are required."
      );

      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    const { data: profile } =
      await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user?.id)
        .single();
    
    setAddingClient(true);
    
    const { error } =
      await supabase
        .from("clients")
        .insert([
          {
            name,
            email,
            phone,
            company:
              isCompany
                ? company
                : "Individual",
            user_id:
              user?.id,
    
            workspace_id:
              profile?.workspace_id,
          },
        ]);

    if (error) {

      setAddingClient(false);

      toast.error(
        error.message
      );

      return;
    }

    setName("");

    setEmail("");

    setPhone("");

    setCompany("");

    setIsCompany(true);

    fetchClients();

    toast.success(
      "Client added successfully!"
    );

    setAddingClient(false);
  }

  async function handleImportClients(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];

    if (!file) return;

    setImportingClients(true);

    try {

      const data =
        await file.arrayBuffer();

      const workbook =
        XLSX.read(data);

      const worksheet =
        workbook.Sheets[
          workbook.SheetNames[0]
        ];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      const {
        data: { user },
      } = await supabase.auth.getUser();


      const { data: profile } =
      await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user?.id)
        .single();

      const formattedClients =
        jsonData.map(
          (row: any) => ({
            name:
              row.name || "",
          
            email:
              row.email || "",
          
            phone:
              row.phone || "",
          
            company:
              row.company ||
              "Individual",
          
            user_id:
              user?.id,
          
            workspace_id:
              profile?.workspace_id,
          })
        );

      const { error } =
        await supabase
          .from("clients")
          .insert(
            formattedClients
          );

      if (error) {

        toast.error(
          error.message
        );

        setImportingClients(false);

        return;
      }

      fetchClients();

      toast.success(
        `${formattedClients.length} clients imported successfully!`
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to import Excel file."
      );
    }

    setImportingClients(false);
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

      toast.error(
        error.message
      );

      return;
    }

    setEditingClientId(null);

    fetchClients();

    toast.success(
      "Client updated successfully!"
    );
  }

  async function handleDeleteClient(
    id: number
  ) {

    const { error } =
      await supabase
        .from("clients")
        .delete()
        .eq("id", id);

    if (error) {

      toast.error(
        "Cannot delete client with reminders."
      );

      return;
    }

    fetchClients();

    toast.success(
      "Client deleted successfully!"
    );
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

  function handleSort(
    field:
      | "name"
      | "company"
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

    const sorted = [
      ...filteredClients,
    ].sort((a, b) => {

      const valueA =
        (
          a[field] || ""
        ).toLowerCase();

      const valueB =
        (
          b[field] || ""
        ).toLowerCase();

      if (direction === "asc") {

        return valueA.localeCompare(
          valueB
        );
      }

      return valueB.localeCompare(
        valueA
      );
    });

    setFilteredClients(
      sorted
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
            className="h-[54px] border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
          />

          <div className="space-y-3">

            <input
              disabled={!isCompany}
              className={`border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                !isCompany
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              placeholder="Company"
              value={
                isCompany
                  ? company
                  : "Individual"
              }
              onChange={(e) =>
                setCompany(
                  e.target.value
                )
              }
            />

            <div className="flex flex-wrap items-center gap-4">

              <button
                type="button"
                onClick={() =>
                  setIsCompany(
                    !isCompany
                  )
                }
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  isCompany
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >

                {isCompany
                  ? "Company Client"
                  : "Individual Client"}

              </button>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-4 mt-4">

          <button
            onClick={handleAddClient}
            disabled={addingClient}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition"
          >

            {addingClient
              ? "Adding Client..."
              : "Add Client"}

          </button>

          <label className="cursor-pointer">

            <input
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={
                handleImportClients
              }
            />

            <div className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl transition inline-flex items-center gap-2">

              {importingClients
                ? "Importing..."
                : "Add Multiple"}

            </div>

          </label>

        </div>

      </div>

      {/* Client Table */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 overflow-hidden">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h2 className="text-2xl font-bold">

              Client List

            </h2>

            <p className="text-gray-500 mt-2">

              Browse and manage your accounting clients.

            </p>

          </div>

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

        {filteredClients.length === 0 ? (

          <div className="text-center py-16">

            <Users
              size={52}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-5 text-xl font-semibold text-slate-800">

              No clients found

            </h3>

            <p className="text-gray-500 mt-2">

              Add your first client to start managing workflows.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b text-left">

                  <th className="px-4 py-4 font-semibold">

                    <button
                      onClick={() =>
                        handleSort("name")
                      }
                      className="hover:text-blue-600 transition"
                    >

                      Name

                    </button>

                  </th>

                  <th className="py-4 px-4 font-semibold text-slate-700">

                    Email

                  </th>

                  <th className="py-4 px-4 font-semibold text-slate-700">

                    Phone

                  </th>

                  <th className="px-4 py-4 font-semibold">

                    <button
                      onClick={() =>
                        handleSort(
                          "company"
                        )
                      }
                      className="hover:text-blue-600 transition"
                    >

                      Company

                    </button>

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

                          client.company ===
                          "Individual" ? (

                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">

                              Individual

                            </span>

                          ) : (

                            client.company

                          )

                        )}

                      </td>

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

                            <ConfirmDialog
                              title="Delete Client"
                              description="This action will permanently remove the client. This cannot be undone."
                              confirmText="Delete"
                              onConfirm={() =>
                                handleDeleteClient(
                                  client.id
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

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}