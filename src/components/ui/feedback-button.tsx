"use client";

import {
  useState,
} from "react";

import {
  MessageSquare,
} from "lucide-react";

export default function FeedbackButton() {

  const [open, setOpen] =
    useState(false);

  return (
    <>
      <button
        onClick={() =>
          setOpen(true)
        }
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          items-center
          gap-2
          rounded-full
          bg-blue-600
          px-4
          py-3
          text-white
          shadow-lg
          hover:bg-blue-700
          transition
        "
      >

        <MessageSquare
          size={18}
        />

        Feedback

      </button>

      {open && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
          "
        >

          <div
            className="
              w-full
              max-w-lg
              rounded-3xl
              bg-white
              p-6
              shadow-2xl
            "
          >

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-bold">

                Send Feedback

              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
              >

                ✕

              </button>

            </div>

            <p className="text-gray-500">

              Feedback form coming next.

            </p>

          </div>

        </div>

      )}
    </>
  );
}