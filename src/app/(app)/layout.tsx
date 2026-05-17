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
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = createClient();

  const router = useRouter();

  const pathname = usePathname();

  const [loading, setLoading] =
    useState(true);

  const [collapsed, setCollapsed] =
    useState(false);

  const [businessName, setBusinessName] =
    useState("TaxNest");

  async function initializeApp() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect routes
    if (!user) {

      router.push("/login");

      return;
    }

    // Fetch profile
    const { data } = await supabase
      .from("profiles")
      .select("business_name")
      .eq("id", user.id)
      .single();

    if (data?.business_name) {

      setBusinessName(
        data.business_name
      );
    }

    setLoading(false);
  }

  useEffect(() => {

    initializeApp();

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

  // Loading State
  if (loading) {

    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading TaxNest...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside
        className={`
          bg-black text-white flex flex-col justify-between shadow-2xl
          sticky top-0 h-screen transition-all duration-300
          ${
            collapsed
              ? "w-24 p-4"
              : "w-72 p-6"
          }
        `}
      >

        <div>

          {/* Top */}
          <div
            className={`
              flex items-center
              ${
                collapsed
                  ? "justify-center"
                  : "justify-between"
              }
              mb-12
            `}
          >

            {!collapsed ? (

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">

                  <ShieldCheck size={24} />

                </div>

                <div>

                  <h1 className="text-2xl font-bold tracking-tight">

                    {businessName}

                  </h1>

                  <p className="text-gray-400 text-sm mt-1">

                    Accountant Workspace

                  </p>

                </div>

              </div>

            ) : (

              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">

                <ShieldCheck size={24} />

              </div>

            )}

            {/* Collapse Button */}
            {!collapsed && (

              <button
                onClick={() =>
                  setCollapsed(true)
                }
                className="text-gray-400 hover:text-white transition"
              >

                <PanelLeftClose size={20} />

              </button>

            )}

          </div>

          {/* Expand Button */}
          {collapsed && (

            <div className="flex justify-center mb-10">

              <button
                onClick={() =>
                  setCollapsed(false)
                }
                className="text-gray-400 hover:text-white transition"
              >

                <PanelLeftOpen size={20} />

              </button>

            </div>

          )}

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
                  className={`
                    flex items-center
                    ${
                      collapsed
                        ? "justify-center px-0"
                        : "gap-3 px-4"
                    }
                    py-3 rounded-2xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-lg"
                        : "hover:bg-gray-900 text-gray-300 hover:text-white"
                    }
                  `}
                >

                  <Icon size={20} />

                  {!collapsed && (

                    <span>
                      {item.name}
                    </span>

                  )}

                </Link>
              );
            })}

          </nav>

        </div>

        {/* Footer */}
        <div className="space-y-4">

          {!collapsed && (

            <div className="border border-gray-800 rounded-2xl p-4 bg-gray-950">

              <p className="text-sm text-gray-400">
                TaxNest Platform
              </p>

              <p className="text-white font-semibold mt-2">
                Secure accountant CRM workspace.
              </p>

            </div>

          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center
              ${
                collapsed
                  ? "justify-center px-0"
                  : "justify-center gap-2 px-4"
              }
              bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200
            `}
          >

            <LogOut size={18} />

            {!collapsed && "Logout"}

          </button>

        </div>

      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 overflow-y-auto h-screen">

        {children}

      </section>

    </main>
  );
}