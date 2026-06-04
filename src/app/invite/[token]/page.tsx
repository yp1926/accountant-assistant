"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import { createClient } from "@/lib/client";

import {
  ShieldCheck,
  ArrowRight,
  Users,
} from "lucide-react";

export default function InvitePage() {

  const supabase =
    createClient();

  const router =
    useRouter();

  const params =
    useParams();

  const token =
    params.token as string;

  const [loading, setLoading] =
    useState(true);

  const [accepting, setAccepting] =
    useState(false);

  const [invitation, setInvitation] =
    useState<any>(null);

  const [workspaceName, setWorkspaceName] =
    useState("Workspace");

  async function loadInvitation() {

    try {

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        router.push(
          `/login?redirect=/invite/${token}`
        );

        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from(
          "workspace_invitations"
        )
        .select("*")
        .eq("token", token)
        .single();

      if (error || !data) {

        toast.error(
          "Invitation not found"
        );

        setLoading(false);

        return;
      }

      if (data.accepted) {

        toast.error(
          "Invitation already used"
        );

        setLoading(false);

        return;
      }

      if (
        new Date(
          data.expires_at
        ) < new Date()
      ) {

        toast.error(
          "Invitation expired"
        );

        setLoading(false);

        return;
      }

      const {
        data: workspace,
      } = await supabase
        .from("workspaces")
        .select("id")
        .eq(
          "id",
          data.workspace_id
        )
        .single();

      if (workspace) {

        setWorkspaceName(
          "TaxNest Workspace"
        );
      }

      setInvitation(data);

      setLoading(false);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load invitation"
      );

      setLoading(false);
    }
  }

  async function acceptInvitation() {

    try {

      setAccepting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {

        router.push(
          `/login?redirect=/invite/${token}`
        );

        return;
      }

      const {
        data: existingMember,
      } = await supabase
        .from(
          "workspace_members"
        )
        .select("id")
        .eq(
          "workspace_id",
          invitation.workspace_id
        )
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle();

      if (
        existingMember
      ) {

        toast.success(
          "Already a member"
        );

        router.push(
          "/dashboard"
        );

        return;
      }

      const {
        error: memberError,
      } = await supabase
        .from(
          "workspace_members"
        )
        .insert({
          workspace_id:
            invitation.workspace_id,

          user_id:
            user.id,

          role:
            invitation.role,
        });

      if (memberError) {

        toast.error(
          memberError.message
        );

        setAccepting(false);

        return;
      }

      const {
        error: invitationError,
      } = await supabase
        .from(
          "workspace_invitations"
        )
        .update({
          accepted: true,
        })
        .eq(
          "id",
          invitation.id
        );

      if (
        invitationError
      ) {

        toast.error(
          invitationError.message
        );

        setAccepting(false);

        return;
      }

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .update({
          workspace_id:
            invitation.workspace_id,
        })
        .eq(
          "id",
          user.id
        );

      if (
        profileError
      ) {

        console.error(
          profileError
        );
      }

      toast.success(
        "Welcome to the workspace!"
      );

      router.push(
        "/dashboard"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to accept invitation"
      );

    } finally {

      setAccepting(false);
    }
  }

  useEffect(() => {

    if (token) {

      loadInvitation();
    }

  }, [token]);

  if (loading) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">

            Loading invitation...

          </p>

        </div>

      </main>
    );
  }

  if (!invitation) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100">

        <div className="bg-white rounded-3xl p-10 shadow-xl max-w-md w-full text-center">

          <h1 className="text-2xl font-bold">

            Invalid Invitation

          </h1>

          <p className="text-gray-500 mt-4">

            This invitation is invalid,
            expired or already used.

          </p>

        </div>

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-100 flex items-center justify-center px-6">

      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10 w-full max-w-xl">

        <div className="flex items-center gap-4 mb-8">

          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">

            <ShieldCheck size={32} />

          </div>

          <div>

            <h1 className="text-3xl font-bold">

              TaxNest

            </h1>

            <p className="text-gray-500">

              Workspace Invitation

            </p>

          </div>

        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">

          <div className="flex items-center gap-3 mb-3">

            <Users size={20} />

            <span className="font-semibold">

              You're invited

            </span>

          </div>

          <p>

            Join:

            <strong className="ml-2">

              {workspaceName}

            </strong>

          </p>

          <p className="mt-2">

            Role:

            <strong className="ml-2 capitalize">

              {invitation.role}

            </strong>

          </p>

          <p className="mt-2 text-sm text-gray-600">

            Invited email:

            <span className="ml-2">

              {invitation.email}

            </span>

          </p>

        </div>

        <button
          onClick={
            acceptInvitation
          }
          disabled={
            accepting
          }
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
        >

          {accepting
            ? "Joining..."
            : (
              <>
                Accept Invitation

                <ArrowRight
                  size={18}
                />
              </>
            )}

        </button>

      </div>

    </main>
  );
}