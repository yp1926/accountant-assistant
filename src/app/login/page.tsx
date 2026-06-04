"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { toast } from "sonner";

import { createClient } from "@/lib/client";

import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {

  const supabase = createClient();

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {

      toast.error(
        error.message
      );

      setLoading(false);

      return;
    }

    toast.success(
      "Login successful!"
    );

    const redirectTo =
      searchParams.get("redirect");

    router.push(
      redirectTo ||
      "/dashboard"
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex">

      {/* Left Side */}
      <section className="hidden lg:flex flex-1 relative overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 text-white p-16">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10 flex flex-col justify-between w-full">

          {/* Logo */}
          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl">

              <ShieldCheck size={32} />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                TaxNest
              </h1>

              <p className="text-blue-100 mt-1">
                Modern accountant workspace
              </p>

            </div>

          </div>

          {/* Hero */}
          <div className="max-w-xl">

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-8">

              Professional Accountant CRM

            </div>

            <h2 className="text-5xl font-bold leading-tight">

              Manage accounting workflows with confidence.

            </h2>

            <p className="text-xl text-blue-100 mt-8 leading-relaxed">

              Organize clients, automate reminders and securely
              manage accounting documents from one intelligent
              platform.

            </p>

          </div>

          {/* Footer */}
          <div className="text-sm text-blue-100">

            © 2026 TaxNest. All rights reserved.

          </div>

        </div>

      </section>

      {/* Right Side */}
      <section className="flex-1 flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-xl">

              <ShieldCheck size={28} />

            </div>

            <div>

              <h1 className="text-3xl font-bold">
                TaxNest
              </h1>

              <p className="text-gray-500 text-sm">
                Accountant Workspace
              </p>

            </div>

          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8">

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">

                Welcome back

              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">

                Login to access your accountant dashboard and
                workspace.

              </p>

            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label className="block text-sm font-medium mb-2">

                  Email

                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="you@example.com"
                />

              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-sm font-medium">

                    Password

                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >

                    Forgot password?

                  </Link>

                </div>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your password"
                />

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >

                {loading
                  ? "Logging in..."
                  : (
                    <>
                      Login

                      <ArrowRight size={18} />
                    </>
                  )}

              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">

              Don’t have an account?{" "}

              <Link
                href="/signup"
                className="text-blue-600 hover:underline font-medium"
              >

                Create account

              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}