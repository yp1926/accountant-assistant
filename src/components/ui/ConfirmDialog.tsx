"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  children: React.ReactNode;
};

export default function ConfirmDialog({
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  children,
}: ConfirmDialogProps) {

  return (
    <AlertDialog.Root>

      <AlertDialog.Trigger asChild>

        {children}

      </AlertDialog.Trigger>

      <AlertDialog.Portal>

        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in" />

        <AlertDialog.Content className="fixed z-50 left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-6 shadow-2xl border border-gray-200">

          <AlertDialog.Title className="text-2xl font-bold text-slate-900">

            {title}

          </AlertDialog.Title>

          <AlertDialog.Description className="mt-3 text-gray-600 leading-relaxed">

            {description}

          </AlertDialog.Description>

          <div className="mt-8 flex items-center justify-end gap-3">

            <AlertDialog.Cancel className="px-5 py-2.5 rounded-2xl border border-gray-300 hover:bg-gray-100 transition font-medium">

              {cancelText}

            </AlertDialog.Cancel>

            <AlertDialog.Action
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white transition font-medium"
            >

              {confirmText}

            </AlertDialog.Action>

          </div>

        </AlertDialog.Content>

      </AlertDialog.Portal>

    </AlertDialog.Root>
  );
}