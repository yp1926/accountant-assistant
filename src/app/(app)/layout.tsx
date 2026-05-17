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
  Menu,
  X,
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

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [businessName, setBusinessName] =
    useState("TaxNest");

  async function initializeApp() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {

      router.push("/login");

      return;
    }

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
    <main className="min-h-screen bg-gray-100">

      {/* Mobile Overlay */}
      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />

      )}

      <div className="flex">

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50
            h-screen bg-black text-white shadow-2xl
            transition-all duration-300

            ${
              mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }

            lg:translate-x-0

            w-72

            ${
              collapsed
                ? "lg:w-24"
                : "lg:w-72"
            }
          `}
        >

          <div
            className={`
              h-full flex flex-col justify-between
              ${
                collapsed
                  ? "p-4"
                  : "p-6"
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

                {/* Desktop Collapse */}
                {!collapsed && (

                  <button
                    onClick={() =>
                      setCollapsed(true)
                    }
                    className="hidden lg:flex text-gray-400 hover:text-white transition"
                  >

                    <PanelLeftClose size={20} />

                  </button>

                )}

                {/* Mobile Close */}
                <button
                  onClick={() =>
                    setMobileOpen(false)
                  }
                  className="lg:hidden text-gray-400 hover:text-white transition"
                >

                  <X size={22} />

                </button>

              </div>

              {/* Desktop Expand */}
              {collapsed && (

                <div className="hidden lg:flex justify-center mb-10">

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
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className={`
                        flex items-center
                        ${
                          collapsed
                            ? "lg:justify-center lg:px-0"
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

                      <span
                        className={`
                          ${
                            collapsed
                              ? "lg:hidden"
                              : "block"
                          }
                        `}
                      >

                        {item.name}

                      </span>

                    </Link>
                  );
                })}

              </nav>

            </div>

            {/* Footer */}
            <div className="space-y-4">

              {!collapsed && (

                <div className="hidden lg:block border border-gray-800 rounded-2xl p-4 bg-gray-950">

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
                      ? "lg:justify-center lg:px-0"
                      : "justify-center gap-2 px-4"
                  }
                  bg-white text-black py-3 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200
                `}
              >

                <LogOut size={18} />

                <span
                  className={`
                    ${
                      collapsed
                        ? "lg:hidden"
                        : "block"
                    }
                  `}
                >

                  Logout

                </span>

              </button>

            </div>

          </div>

        </aside>

        {/* Main Area */}
        <div
          className={`
            flex-1 flex flex-col min-h-screen
            transition-all duration-300

            ${
              collapsed
                ? "lg:ml-24"
                : "lg:ml-72"
            }
          `}
        >

          {/* Mobile Topbar */}
          <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">

                <ShieldCheck size={20} />

              </div>

              <div>

                <h1 className="font-bold">
                  TaxNest
                </h1>

                <p className="text-xs text-gray-500">
                  Workspace
                </p>

              </div>

            </div>

            <button
              onClick={() =>
                setMobileOpen(true)
              }
              className="text-slate-700"
            >

              <Menu size={24} />

            </button>

          </header>

          {/* Main Content */}
          <section className="flex-1 w-full overflow-x-hidden p-4 sm:p-6 lg:p-8">

            <div className="w-full max-w-full">

              {children}

            </div>

          </section>

        </div>

      </div>

    </main>
  );
}