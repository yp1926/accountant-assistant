"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6">

        <h1 className="text-2xl font-bold mb-10">
          Accountant AI
        </h1>

        <nav className="space-y-4">

          <Link
            href="/dashboard"
            className="block hover:text-gray-300"
          >
            Dashboard
          </Link>

          <Link
            href="/clients"
            className="block hover:text-gray-300"
          >
            Clients
          </Link>

          <Link
            href="/reminders"
            className="block hover:text-gray-300"
          >
            Reminders
          </Link>

        </nav>

        <button
          onClick={handleLogout}
          className="mt-10 bg-white text-black px-4 py-2 rounded"
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8">
        {children}
      </section>

    </main>
  );
}