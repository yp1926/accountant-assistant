"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import { createClient } from "@/lib/client";

import {
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function SignupPage() {

  const supabase = createClient();

  const router = useRouter();

  const [businessName, setBusinessName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSignup(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");

    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      setError(error.message);

      setLoading(false);

      return;
    }

    // Create profile
    if (data.user) {

      await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          business_name: businessName,
        });
    }

    setSuccess(
      "Account created successfully. You can now login."
    );

    setLoading(false);

    setTimeout(() => {

      router.push("/login");

    }, 2000);
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

              Build your modern accounting workspace.

            </h2>

            <p className="text-xl text-blue-100 mt-8 leading-relaxed">

              Create your TaxNest account and start managing
              clients, reminders and accounting workflows from
              one centralized platform.

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

                Create account

              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">

                Start using TaxNest to manage your accounting
                workflow professionally.

              </p>

            </div>

            <form
              onSubmit={handleSignup}
              className="space-y-5"
            >

              {/* Business Name */}
              <div>

                <label className="block text-sm font-medium mb-2">

                  Business Name

                </label>

                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Your accounting firm"
                />

              </div>

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

                <label className="block text-sm font-medium mb-2">

                  Password

                </label>

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Create a password"
                />

              </div>

              {/* Error */}
              {error && (

                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-2xl text-sm">

                  {error}

                </div>

              )}

              {/* Success */}
              {success && (

                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl text-sm">

                  {success}

                </div>

              )}

              {/* Signup Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2"
              >

                {loading
                  ? "Creating account..."
                  : (
                    <>
                      Create Account

                      <ArrowRight size={18} />
                    </>
                  )}

              </button>

            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">

              Already have an account?{" "}

              <Link
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >

                Login

              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}