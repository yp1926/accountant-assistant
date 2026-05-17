"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";

export default function SettingsPage() {

  const supabase = createClient();

  const [businessName, setBusinessName] =
    useState("");

  const [brandColor, setBrandColor] =
    useState("#111827");

  async function fetchProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (!error && data) {

      setBusinessName(
        data.business_name || ""
      );

      setBrandColor(
        data.brand_color || "#111827"
      );
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  async function handleSaveSettings() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update({
        business_name: businessName,
        brand_color: brandColor,
      })
      .eq("id", user?.id);

    if (error) {

      alert(error.message);

    } else {

      alert("Settings updated!");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white p-8 rounded-lg shadow">

          <h1 className="text-3xl font-bold mb-8">
            Settings
          </h1>

          <div className="space-y-6">

            <div>

              <label className="block mb-2 font-medium">
                Business Name
              </label>

              <input
                className="border p-3 rounded w-full"
                value={businessName}
                onChange={(e) =>
                  setBusinessName(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Brand Color
              </label>

              <input
                type="color"
                className="w-24 h-12"
                value={brandColor}
                onChange={(e) =>
                  setBrandColor(
                    e.target.value
                  )
                }
              />

            </div>

            <button
              onClick={handleSaveSettings}
              className="bg-black text-white px-6 py-3 rounded"
            >
              Save Settings
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}