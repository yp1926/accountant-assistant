"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/lib/client";

export default function ForgotPasswordPage() {

  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleResetPassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        }
      );

    if (error) {

      setError(error.message);

      setLoading(false);

      return;
    }

    setSuccess(
      "Password reset email sent successfully."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-3">

            Enter your email and we’ll send you a
            password reset link.

          </p>

        </div>

        <form
          onSubmit={handleResetPassword}
          className="space-y-5"
        >

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
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />

          </div>

          {error && (

            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">

              {error}

            </div>

          )}

          {success && (

            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl text-sm">

              {success}

            </div>

          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >

            {loading
              ? "Sending..."
              : "Send Reset Link"}

          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">

          Remember your password?{" "}

          <Link
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </main>
  );
}