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
};

type Document = {
  id: number;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
  clients?: {
    id: number;
    name: string;
  };
};

export default function DocumentsPage() {

  const supabase = createClient();

  const [clients, setClients] =
    useState<Client[]>([]);

  const [documents, setDocuments] =
    useState<Document[]>([]);

  const [filteredDocuments, setFilteredDocuments] =
    useState<Document[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedClientId, setSelectedClientId] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  async function fetchClients() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user?.id)
      .order("name");

    if (data) {

      setClients(data);
    }
  }

  async function fetchDocuments() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("documents")
      .select(`
        *,
        clients (
          id,
          name
        )
      `)
      .eq("user_id", user?.id)
      .order("id", {
        ascending: false,
      });

    if (data) {

      setDocuments(data);

      setFilteredDocuments(data);
    }
  }

  useEffect(() => {

    fetchClients();

    fetchDocuments();

  }, []);

  useEffect(() => {

    const filtered =
      documents.filter(
        (doc) =>

          doc.file_name
            .toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            ) ||

          doc.clients?.name
            ?.toLowerCase()
            .startsWith(
              searchTerm.toLowerCase()
            )
      );

    setFilteredDocuments(filtered);

  }, [searchTerm, documents]);

  async function handleUpload() {

    if (!selectedFile) {

      alert(
        "Please select a file."
      );

      return;
    }

    if (!selectedClientId) {

      alert(
        "Please select a client."
      );

      return;
    }

    // Allowed types
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ];

    // Max 10MB
    const maxSize =
      10 * 1024 * 1024;

    // Validate file type
    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {

      alert(
        "Invalid file type. Allowed: PDF, DOCX, XLSX, JPG, PNG."
      );

      return;
    }

    // Validate file size
    if (
      selectedFile.size > maxSize
    ) {

      alert(
        "File too large. Maximum size is 10MB."
      );

      return;
    }

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const fileExt =
      selectedFile.name
        .split(".")
        .pop();

    const fileName =
      `${Date.now()}.${fileExt}`;

    const filePath =
      `${user?.id}/${fileName}`;

    // Upload file
    const { error: uploadError } =
      await supabase.storage
        .from("documents")
        .upload(
          filePath,
          selectedFile
        );

    if (uploadError) {

      alert(
        uploadError.message
      );

      setUploading(false);

      return;
    }

    // Save DB
    const { error: dbError } =
      await supabase
        .from("documents")
        .insert([
          {
            user_id:
              user?.id,
            client_id:
              Number(
                selectedClientId
              ),
            file_name:
              selectedFile.name,
            file_path:
              filePath,
            file_size:
              selectedFile.size,
          },
        ]);

    if (dbError) {

      alert(
        dbError.message
      );

    } else {

      alert(
        "Document uploaded!"
      );

      setSelectedFile(
        null
      );

      setSelectedClientId(
        ""
      );

      fetchDocuments();
    }

    setUploading(false);
  }

  async function handleDownload(
    filePath: string,
    fileName: string
  ) {

    const { data, error } =
      await supabase.storage
        .from("documents")
        .download(filePath);

    if (error) {

      alert(
        error.message
      );

      return;
    }

    const url =
      window.URL.createObjectURL(
        data
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;

    a.download = fileName;

    a.click();
  }

  async function handleDelete(
    id: number,
    filePath: string
  ) {

    const confirmed =
      confirm(
        "Delete this document?"
      );

    if (!confirmed) return;

    // Delete file
    await supabase.storage
      .from("documents")
      .remove([
        filePath,
      ]);

    // Delete DB record
    await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    alert(
      "Document deleted!"
    );

    fetchDocuments();
  }

  function getFileType(
    fileName: string
  ) {

    const ext =
      fileName
        .split(".")
        .pop()
        ?.toUpperCase();

    return ext || "FILE";
  }

  return (
    <main className="space-y-8">

      {/* Upload */}
      <div className="bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Documents
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Client */}
          <select
            className="border p-3 rounded"
            value={
              selectedClientId
            }
            onChange={(e) =>
              setSelectedClientId(
                e.target.value
              )
            }
          >

            <option value="">
              Select Client
            </option>

            {clients.map(
              (client) => (

                <option
                  key={client.id}
                  value={
                    client.id
                  }
                >
                  {client.name}
                </option>

              )
            )}

          </select>

          {/* File */}
          <input
            type="file"
            className="border p-3 rounded"
            onChange={(e) =>
              setSelectedFile(
                e.target
                  .files?.[0] ||
                  null
              )
            }
          />

          {/* Upload */}
          <button
            onClick={
              handleUpload
            }
            disabled={uploading}
            className="bg-black text-white rounded px-6 py-3"
          >

            {uploading
              ? "Uploading..."
              : "Upload Document"}

          </button>

        </div>

        {/* Info */}
        <div className="mt-4 text-sm text-gray-500">

          Allowed:
          PDF, DOCX, XLSX,
          JPG, PNG

          <br />

          Max Size:
          10MB

        </div>

      </div>

      {/* Documents */}
      <div className="bg-white p-8 rounded-2xl shadow overflow-x-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-2xl font-bold">
            Uploaded Documents
          </h2>

          <input
            className="border p-3 rounded w-full md:w-80"
            placeholder="Search documents..."
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
                Type
              </th>

              <th className="p-3">
                File Name
              </th>

              <th className="p-3">
                Client
              </th>

              <th className="p-3">
                Size
              </th>

              <th className="p-3">
                Uploaded
              </th>

              <th className="p-3">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredDocuments.map(
              (doc) => (

                <tr
                  key={doc.id}
                  className="border-b"
                >

                  {/* File Type */}
                  <td className="p-3">

                    <span className="bg-gray-200 px-3 py-1 rounded text-sm font-medium">

                      {getFileType(
                        doc.file_name
                      )}

                    </span>

                  </td>

                  {/* File Name */}
                  <td className="p-3 font-medium">

                    {
                      doc.file_name
                    }

                  </td>

                  {/* Client */}
                  <td className="p-3">

                    <Link
                      href={`/clients/${doc.clients?.id}`}
                      className="text-blue-600 font-semibold hover:underline"
                    >

                      {
                        doc.clients
                          ?.name
                      }

                    </Link>

                  </td>

                  {/* Size */}
                  <td className="p-3">

                    {(
                      doc.file_size /
                      1024
                    ).toFixed(2)}{" "}
                    KB

                  </td>

                  {/* Date */}
                  <td className="p-3">

                    {new Date(
                      doc.created_at
                    ).toLocaleDateString()}

                  </td>

                  {/* Actions */}
                  <td className="p-3">

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleDownload(
                            doc.file_path,
                            doc.file_name
                          )
                        }
                        className="bg-black text-white px-3 py-2 rounded"
                      >
                        Download
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            doc.id,
                            doc.file_path
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

    </main>
  );
}