"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import {
  Settings,
  Building2,
  Palette,
  ShieldCheck,
  Save,
} from "lucide-react";

export default function SettingsPage() {

  const supabase = createClient();

  const [businessName, setBusinessName] =
    useState("");

  const [brandColor, setBrandColor] =
    useState("#2563eb");

  const [loading, setLoading] =
    useState(false);

  async function fetchProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (!error && data) {

      setBusinessName(
        data.business_name || ""
      );

      setBrandColor(
        data.brand_color || "#2563eb"
      );
    }
  }

  useEffect(() => {

    fetchProfile();

  }, []);

  async function handleSaveSettings() {

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } =
      await supabase
        .from("profiles")
        .update({
          business_name: businessName,
          brand_color: brandColor,
        })
        .eq("id", user?.id);

    if (error) {

      alert(error.message);

    } else {

      alert(
        "Settings updated successfully!"
      );
    }

    setLoading(false);
  }

  return (
    <main className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

            Workspace Configuration

          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">

                Settings

              </h1>

              <p className="text-blue-100 mt-4 text-lg max-w-2xl leading-relaxed">

                Customize your TaxNest workspace, branding and account preferences.

              </p>

            </div>

            <div className="bg-white/10 border border-white/10 backdrop-blur-sm rounded-3xl p-6 min-w-[220px]">

              <div className="flex items-center gap-4">

                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                  <Settings size={28} />

                </div>

                <div>

                  <p className="text-blue-100 text-sm">
                    Workspace
                  </p>

                  <h2 className="text-3xl font-bold mt-1">

                    Active

                  </h2>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Main Settings */}
        <div className="xl:col-span-2 space-y-8">

          {/* Business Settings */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">

                <Building2 size={24} />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Business Profile
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage your workspace identity.
                </p>

              </div>

            </div>

            <div className="space-y-6">

              {/* Business Name */}
              <div>

                <label className="block mb-3 font-medium text-slate-700">

                  Business Name

                </label>

                <input
                  className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  placeholder="Your accounting business"
                />

              </div>

              {/* Brand Color */}
              <div>

                <label className="block mb-3 font-medium text-slate-700">

                  Brand Color

                </label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  <input
                    type="color"
                    className="w-24 h-14 rounded-xl border border-gray-300 bg-white cursor-pointer"
                    value={brandColor}
                    onChange={(e) =>
                      setBrandColor(
                        e.target.value
                      )
                    }
                  />

                  <div className="flex items-center gap-3">

                    <div
                      className="w-10 h-10 rounded-xl border border-gray-200"
                      style={{
                        backgroundColor:
                          brandColor,
                      }}
                    />

                    <div>

                      <p className="font-semibold">
                        {brandColor}
                      </p>

                      <p className="text-sm text-gray-500">
                        Primary workspace accent
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* Save */}
              <button
                onClick={
                  handleSaveSettings
                }
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition flex items-center gap-2"
              >

                <Save size={18} />

                {loading
                  ? "Saving..."
                  : "Save Settings"}

              </button>

            </div>

          </div>

          {/* Security */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

            <div className="flex items-center gap-3 mb-8">

              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">

                <ShieldCheck size={24} />

              </div>

              <div>

                <h2 className="text-2xl font-bold">
                  Security
                </h2>

                <p className="text-gray-500 mt-1">
                  Workspace protection and account safety.
                </p>

              </div>

            </div>

            <div className="space-y-5">

              <div className="border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    Secure Authentication
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Supabase authentication enabled.
                  </p>

                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">

                  Active

                </span>

              </div>

              <div className="border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <h3 className="font-semibold text-lg">
                    Row Level Security
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Database access isolation enabled.
                  </p>

                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold w-fit">

                  Protected

                </span>

              </div>

            </div>

          </div>

        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">

          {/* Branding Preview */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">

                <Palette size={24} />

              </div>

              <div>

                <h2 className="text-xl font-bold">
                  Branding Preview
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Live workspace appearance.
                </p>

              </div>

            </div>

            <div className="border border-gray-200 rounded-3xl overflow-hidden">

              {/* Preview Header */}
              <div
                className="h-24"
                style={{
                  background:
                    `linear-gradient(135deg, ${brandColor}, #0f172a)`,
                }}
              />

              {/* Preview Body */}
              <div className="p-5">

                <div className="flex items-center gap-3">

                  <div
                    className="w-12 h-12 rounded-2xl"
                    style={{
                      backgroundColor:
                        brandColor,
                    }}
                  />

                  <div>

                    <h3 className="font-bold text-lg">

                      {businessName ||
                        "Your Business"}

                    </h3>

                    <p className="text-gray-500 text-sm">
                      TaxNest Workspace
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Platform Info */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 text-white relative overflow-hidden">

            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20" />

            <div className="relative z-10">

              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

                TaxNest Platform

              </div>

              <h2 className="text-2xl font-bold leading-tight">

                Professional accountant workspace.

              </h2>

              <p className="text-blue-100 mt-4 leading-relaxed">

                Built for modern accounting firms that need secure client management and workflow automation.

              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}