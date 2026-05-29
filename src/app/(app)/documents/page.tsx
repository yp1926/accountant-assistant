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
  FolderOpen,
  Upload,
  Search,
  Download,
  Trash2,
  FileText,
  ImageIcon,
  FileSpreadsheet,
} from "lucide-react";

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

    const { data: profile } =
    await supabase
      .from("profiles")
      .select("workspace_id")
      .eq("id", user?.id)
      .single();

    const { data } = await supabase
      .from("clients")
      .select("id, name")
      .eq(
        "workspace_id",
        profile?.workspace_id
      )
      .order("name");

        if (data) {

          setClients(data);
        }
      }

  async function fetchDocuments() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } =
  await supabase
    .from("profiles")
    .select("workspace_id")
    .eq("id", user?.id)
    .single();

  const { data } = await supabase
    .from("documents")
    .select(`
      *,
      clients (
        id,
        name
      )
    `)
    .eq(
      "workspace_id",
      profile?.workspace_id
    )
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
            .includes(
              searchTerm.toLowerCase()
            ) ||

          doc.clients?.name
            ?.toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            )
      );

    setFilteredDocuments(filtered);

  }, [searchTerm, documents]);

  async function handleUpload() {

    if (!selectedFile) {

      toast.error(
        "Please select a file."
      );

      return;
    }

    if (!selectedClientId) {

      toast.error(
        "Please select a client."
      );

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
    ];

    const maxSize =
      10 * 1024 * 1024;

    if (
      !allowedTypes.includes(
        selectedFile.type
      )
    ) {

      toast.error(
        "Invalid file type."
      );

      return;
    }

    if (
      selectedFile.size >
      maxSize
    ) {

      toast.error(
        "File too large."
      );

      return;
    }

    setUploading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("workspace_id")
        .eq("id", user?.id)
        .single();

    const fileExt =
      selectedFile.name
        .split(".")
        .pop();

    const fileName =
      `${Date.now()}.${fileExt}`;

    const filePath =
      `${user?.id}/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("documents")
        .upload(
          filePath,
          selectedFile
        );

    if (uploadError) {

      toast.error(
        uploadError.message
      );

      setUploading(false);

      return;
    }

    const { error: dbError } =
      await supabase
        .from("documents")
        .insert([
          {
            user_id:
              user?.id,

            workspace_id:
              profile?.workspace_id,

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

      toast.error(
        dbError.message
      );

    } else {

      toast.success(
        "Document uploaded successfully!"
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

      toast.error(
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

    toast.success(
      "Download started."
    );
  }

  async function handleDelete(
    id: number,
    filePath: string
  ) {

    await supabase.storage
      .from("documents")
      .remove([
        filePath,
      ]);

    await supabase
      .from("documents")
      .delete()
      .eq("id", id);

    fetchDocuments();

    toast.success(
      "Document deleted successfully!"
    );
  }

  function getFileType(
    fileName: string
  ) {

    const ext =
      fileName
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      ext === "pdf"
    ) {

      return {
        label: "PDF",
        icon: FileText,
        color:
          "bg-red-100 text-red-600",
      };
    }

    if (
      ext === "xlsx"
    ) {

      return {
        label: "XLSX",
        icon: FileSpreadsheet,
        color:
          "bg-green-100 text-green-600",
      };
    }

    if (
      ext === "png" ||
      ext === "jpg" ||
      ext === "jpeg"
    ) {

      return {
        label: "IMG",
        icon: ImageIcon,
        color:
          "bg-blue-100 text-blue-600",
      };
    }

    return {
      label: "DOC",
      icon: FileText,
      color:
        "bg-gray-100 text-gray-700",
    };
  }

  return (
    <main className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

            Secure Document Storage

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">

                Documents

              </h1>

              <p className="text-blue-100 mt-4 text-lg max-w-2xl leading-relaxed">

                Upload, organize and securely manage accounting documents for clients.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[220px]">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <FolderOpen size={28} />

                </div>

                <div>

                  <p className="text-blue-100 text-sm">
                    Total Documents
                  </p>

                  <h2 className="text-4xl font-bold mt-1">

                    {documents.length}

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Upload */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="flex items-center gap-3 mb-8">

          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

            <Upload size={24} />

          </div>

          <div>

            <h2 className="text-2xl font-bold">
              Upload Document
            </h2>

            <p className="text-gray-500 mt-1">
              Add files securely to client records.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <select
            className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

          <input
            type="file"
            className="border border-gray-300 rounded-2xl px-4 py-3"
            onChange={(e) =>
              setSelectedFile(
                e.target
                  .files?.[0] ||
                  null
              )
            }
          />

          <button
            onClick={
              handleUpload
            }
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-3 font-semibold transition"
          >

            {uploading
              ? "Uploading..."
              : "Upload Document"}

          </button>

        </div>

        <div className="mt-5 text-sm text-gray-500 leading-relaxed">

          Allowed formats:
          PDF, DOCX, XLSX, JPG, PNG

          <br />

          Maximum upload size:
          10MB

        </div>

      </div>

      {/* Documents */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 overflow-hidden">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

          <div>

            <h2 className="text-2xl font-bold">
              Uploaded Documents
            </h2>

            <p className="text-gray-500 mt-2">
              Browse and manage client files securely.
            </p>

          </div>

          <div className="relative w-full lg:w-80">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              className="w-full border border-gray-300 rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {filteredDocuments.length === 0 ? (

          <div className="text-center py-16">

            <FolderOpen
              size={52}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-5 text-xl font-semibold text-slate-800">

              No documents found

            </h3>

            <p className="text-gray-500 mt-2">

              Upload your first accounting document to begin organizing files.

            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead>

                <tr className="border-b text-left">

                  <th className="px-4 py-4 font-semibold">
                    Type
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    File Name
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Client
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Size
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Uploaded
                  </th>

                  <th className="px-4 py-4 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredDocuments.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-16 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center">

                          <Upload
                            size={32}
                            className="text-gray-400"
                          />

                        </div>

                        <h3 className="mt-5 text-xl font-semibold text-slate-800">

                          No documents uploaded

                        </h3>

                        <p className="text-gray-500 mt-2 max-w-md">

                          Upload tax files, invoices, reports and accounting documents securely for your clients.

                        </p>

                      </div>

                    </td>

                  </tr>

                ) : (

                  filteredDocuments.map(
                    (doc) => {

                      const file =
                        getFileType(
                          doc.file_name
                        );

                      const Icon =
                        file.icon;

                      return (

                        <tr
                          key={doc.id}
                          className="border-b hover:bg-gray-50 transition"
                        >

                          <td className="px-4 py-5">

                            <div
                              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold ${file.color}`}
                            >

                              <Icon size={16} />

                              {file.label}

                            </div>

                          </td>

                          <td className="px-4 py-5 font-medium">

                            {doc.file_name}

                          </td>

                          <td className="px-4 py-5">

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

                          <td className="px-4 py-5">

                            {(
                              doc.file_size /
                              1024
                            ).toFixed(2)}{" "}
                            KB

                          </td>

                          <td className="px-4 py-5">

                            {new Date(
                              doc.created_at
                            ).toLocaleDateString()}

                          </td>

                          <td className="px-4 py-5">

                            <div className="flex flex-wrap gap-2">

                              <button
                                onClick={() =>
                                  handleDownload(
                                    doc.file_path,
                                    doc.file_name
                                  )
                                }
                                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition flex items-center gap-2"
                              >

                                <Download size={16} />

                                Download

                              </button>

                              <ConfirmDialog
                                title="Delete Document"
                                description="This document will be permanently deleted from storage. This action cannot be undone."
                                confirmText="Delete"
                                onConfirm={() =>
                                  handleDelete(
                                    doc.id,
                                    doc.file_path
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

                      );
                    }
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