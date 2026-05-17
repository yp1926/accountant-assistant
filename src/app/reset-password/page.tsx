"use client";

import {
  useState,
} from "react";

import Link from "next/link";

import { createClient } from "@/lib/client";

import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {

  const supabase = createClient();

  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleUpdatePassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {

      setError(error.message);

      setLoading(false);

      return;
    }

    setSuccess(
      "Password updated successfully."
    );

    setLoading(false);

    setTimeout(() => {

      router.push("/login");

    }, 2000);
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold">
            Reset Password
          </h1>

          <p className="text-gray-500 mt-3">

            Enter your new password below.

          </p>

        </div>

        <form
          onSubmit={handleUpdatePassword}
          className="space-y-5"
        >

          <div>

            <label className="block text-sm font-medium mb-2">
              New Password
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
              className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
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
              ? "Updating..."
              : "Update Password"}

          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-500">

          Back to{" "}

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