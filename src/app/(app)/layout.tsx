"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { createClient } from "@/lib/client";

import {
  LayoutDashboard,
  Users,
  Bell,
  FolderOpen,
  Settings,
  LogOut,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient();

  const router = useRouter();

  const pathname = usePathname();

  const [businessName, setBusinessName] =
    useState("Accountant AI");

  async function fetchProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
      .from("profiles")
      .select("business_name")
      .eq("id", user?.id)
      .single();

    if (data?.business_name) {

      setBusinessName(
        data.business_name
      );
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleLogout() {

    await supabase.auth.signOut();

    router.push("/login");
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      href: "/clients",
      icon: Users,
    },
    {
      name: "Reminders",
      href: "/reminders",
      icon: Bell,
    },
    {
      name: "Documents",
      href: "/documents",
      icon: FolderOpen,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-72 bg-black text-white flex flex-col justify-between p-6 shadow-2xl">

        <div>

          {/* Logo */}
          <div className="mb-12">

            <h1 className="text-3xl font-bold tracking-tight">
              {businessName}
            </h1>

            <p className="text-gray-400 mt-2 text-sm">
              Smart accountant CRM platform
            </p>

          </div>

          {/* Navigation */}
          <nav className="space-y-3">

            {navigation.map((item) => {

              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (

                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white text-black font-semibold"
                      : "hover:bg-gray-900 text-gray-300 hover:text-white"
                  }`}
                >

                  <Icon size={20} />

                  <span>
                    {item.name}
                  </span>

                </Link>
              );
            })}

          </nav>

        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-gray-800">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-white text-black px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 overflow-y-auto">
        {children}
      </section>

    </main>
  );
}