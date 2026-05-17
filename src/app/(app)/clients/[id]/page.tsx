"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
};

type Reminder = {
  id: number;
  message: string;
  due_date: string;
  status: string;
};

type Document = {
  id: number;
  file_name: string;
  created_at: string;
};

export default function ClientProfilePage() {

  const supabase = createClient();

  const router = useRouter();

  const params = useParams();

  const clientId = params.id;

  const [client, setClient] =
    useState<Client | null>(null);

  const [reminders, setReminders] =
    useState<Reminder[]>([]);

  const [documents, setDocuments] =
    useState<Document[]>([]);

  async function fetchClientData() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

    // Client Info
    const { data: clientData } =
      await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .eq("user_id", user.id)
        .single();

    setClient(clientData);

    // Client Reminders
    const { data: remindersData } =
      await supabase
        .from("reminders")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user.id)
        .order("due_date", {
          ascending: true,
        });

    setReminders(
      remindersData || []
    );

    // Client Documents
    const { data: documentsData } =
      await supabase
        .from("documents")
        .select("*")
        .eq("client_id", clientId)
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

    setDocuments(
      documentsData || []
    );
  }

  useEffect(() => {

    if (clientId) {

      fetchClientData();
    }

  }, [clientId]);

  if (!client) {

    return (
      <div className="text-gray-500">
        Loading client...
      </div>
    );
  }

  return (
    <main className="space-y-8">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold">
          {client.name}
        </h1>

        <p className="text-gray-500 mt-2">
          Client Profile
        </p>

      </div>

      {/* Client Info */}
      <Card>

        <CardContent className="p-8">

          <h2 className="text-2xl font-bold mb-6">
            Client Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-medium mt-1">
                {client.email}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-medium mt-1">
                {client.phone}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                Company
              </p>

              <p className="font-medium mt-1">
                {client.company}
              </p>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* Reminders */}
      <Card>

        <CardContent className="p-8">

          <h2 className="text-2xl font-bold mb-6">
            Reminders
          </h2>

          <div className="space-y-4">

            {reminders.length === 0 ? (

              <p className="text-gray-500">
                No reminders found.
              </p>

            ) : (

              reminders.map(
                (reminder) => (

                  <div
                    key={reminder.id}
                    className="border rounded-xl p-4 flex items-center justify-between"
                  >

                    <div>

                      <p className="font-medium">
                        {reminder.message}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Due:
                        {" "}
                        {reminder.due_date}
                      </p>

                    </div>

                    <div
                      className={`text-sm font-semibold capitalize ${
                        reminder.status === "sent"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {reminder.status}
                    </div>

                  </div>

                )
              )

            )}

          </div>

        </CardContent>

      </Card>

      {/* Documents */}
      <Card>

        <CardContent className="p-8">

          <h2 className="text-2xl font-bold mb-6">
            Documents
          </h2>

          <div className="space-y-4">

            {documents.length === 0 ? (

              <p className="text-gray-500">
                No documents uploaded.
              </p>

            ) : (

              documents.map(
                (doc) => (

                  <div
                    key={doc.id}
                    className="border rounded-xl p-4 flex items-center justify-between"
                  >

                    <div>

                      <p className="font-medium">
                        {doc.file_name}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        Uploaded:
                        {" "}
                        {new Date(
                          doc.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </CardContent>

      </Card>

    </main>
  );
}