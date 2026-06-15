"use client";

import {
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/client";

import {
  Users,
  UserCog,
  Mail,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

type TeamMember = {
  id: string;
  role: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string | null;
  };
};

export default function TeamPage() {

  const supabase = createClient();

  const [members, setMembers] =
    useState<TeamMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [inviteOpen, setInviteOpen] =
    useState(false);

  const [inviteEmail, setInviteEmail] =
    useState("");

  const [inviteRole, setInviteRole] =
    useState("accountant");

  const [inviteLink, setInviteLink] =
    useState("");

  const [pendingInvites, setPendingInvites] =
    useState<any[]>([]);

    async function fetchMembers() {

        try {
      
          const {
            data: { user },
          } = await supabase.auth.getUser();
      
          if (!user) {
      
            setLoading(false);
      
            return;
          }
      
          const {
            data: profile,
          } = await supabase
            .from("profiles")
            .select("workspace_id")
            .eq("id", user.id)
            .single();
      
          if (
            !profile?.workspace_id
          ) {
      
            setLoading(false);
      
            return;
          }
      
          const {
            data: membersData,
            error: membersError,
          } = await supabase
            .from("workspace_members")
            .select("*")
            .eq(
              "workspace_id",
              profile.workspace_id
            )
            .order(
              "created_at",
              {
                ascending: true,
              }
            );
          
          if (
            membersError ||
            !membersData
          ) {
          
            setLoading(false);
          
            return;
          }
          
          const userIds =
            membersData.map(
              (member) =>
                member.user_id
            );
          
          const {
            data: profilesData,
          } = await supabase
            .from("profiles")
            .select(`
              id,
              full_name,
              email
            `)
            .in(
              "id",
              userIds
            );
          
          const profileMap =
            Object.fromEntries(
              (profilesData || []).map(
                (profile) => [
                  profile.id,
                  profile,
                ]
              )
            );
          
          const mergedMembers =
            membersData.map(
              (member) => ({
                ...member,
                profiles:
                  profileMap[
                    member.user_id
                  ] || null,
              })
            );
          
          setMembers(
            mergedMembers as TeamMember[]
          );
      
        } catch (err) {
      
          console.error(
            "TEAM ERROR",
            err
          );
      
        } finally {
      
          setLoading(false);
      
        }
      }

      async function fetchInvitations() {

        try {
      
          const {
            data: { user },
          } = await supabase.auth.getUser();
      
          if (!user) return;
      
          const { data: profile } =
            await supabase
              .from("profiles")
              .select("workspace_id")
              .eq("id", user.id)
              .single();
      
          if (!profile?.workspace_id) {
            return;
          }
      
          const {
            data,
            error,
          } = await supabase
            .from("workspace_invitations")
            .select("*")
            .eq(
              "workspace_id",
              profile.workspace_id
            )
            .eq(
              "accepted",
              false
            )
            .order(
              "created_at",
              {
                ascending: false,
              }
            );
      
          if (error) {
      
            console.error(
              "INVITES ERROR",
              error
            );
      
            return;
          }
      
          setPendingInvites(
            data || []
          );
      
        } catch (err) {
      
          console.error(err);
      
        }
      }

      async function handleCreateInvite() {

        try {
      
          const {
            data: { user },
          } = await supabase.auth.getUser();
      
          if (!user) return;
      
          const { data: profile } =
            await supabase
              .from("profiles")
              .select("workspace_id")
              .eq("id", user.id)
              .single();
      
          if (!profile?.workspace_id) {
      
            toast.error(
              "Workspace not found"
            );
      
            return;
          }
      
          const token =
            crypto.randomUUID();
      
          const expiresAt =
            new Date(
              Date.now() +
              7 * 24 * 60 * 60 * 1000
            ).toISOString();
      
          const {
            error,
          } = await supabase
            .from(
              "workspace_invitations"
            )
            .insert({
              workspace_id:
                profile.workspace_id,
      
              email:
                inviteEmail,
      
              role:
                inviteRole,
      
              token,
      
              expires_at:
                expiresAt,
            });
      
          if (error) {
      
            toast.error(
              error.message
            );
      
            return;
          }
      
          const inviteUrl =
            `${window.location.origin}/invite/${token}`;
      
          setInviteLink(
            inviteUrl
          );

          fetchInvitations();
      
          navigator.clipboard.writeText(
            inviteUrl
          );
      
          toast.success(
            "Invitation created and copied to clipboard"
          );
      
        } catch (error) {
      
          console.error(error);
      
          toast.error(
            "Failed to create invitation"
          );
        }
      }

      async function handleCancelInvite(
        inviteId: string
      ) {
      
        const confirmed =
          window.confirm(
            "Are you sure you want to cancel this invitation?"
          );
      
        if (!confirmed) {
          return;
        }
      
        try {
      
          const {
            error,
          } = await supabase
            .from(
              "workspace_invitations"
            )
            .delete()
            .eq(
              "id",
              inviteId
            );
      
          if (error) {
      
            toast.error(
              error.message
            );
      
            return;
          }
      
          setPendingInvites(
            (current) =>
              current.filter(
                (invite) =>
                  invite.id !== inviteId
              )
          );
      
          toast.success(
            "Invitation cancelled"
          );
      
        } catch (error) {
      
          console.error(error);
      
          toast.error(
            "Failed to cancel invitation"
          );
        }
      }

      function handleCopyInviteLink(
        token: string
      ) {
      
        const inviteUrl =
          `${window.location.origin}/invite/${token}`;
      
        navigator.clipboard.writeText(
          inviteUrl
        );
      
        toast.success(
          "Invite link copied"
        );
      }

      useEffect(() => {

        fetchMembers();
        fetchInvitations();
      
      }, []);

  return (
    <main className="space-y-8">

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 lg:p-10 text-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          <div>

            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-full text-sm mb-6">

              Workspace Team

            </div>

            <h1 className="text-4xl sm:text-5xl font-bold">

              Team Management

            </h1>

            <p className="text-blue-100 mt-4 text-lg">

              Manage accountants and staff inside your workspace.

            </p>

          </div>

          <div className="bg-white/10 border border-white/10 rounded-3xl p-6 min-w-[220px]">

            <div className="flex items-center gap-4">

              <Users size={32} />

              <div>

                <p className="text-blue-100 text-sm">

                  Total Members

                </p>

                <h2 className="text-4xl font-bold">

                  {members.length}

                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Members */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="flex items-center justify-between mb-8">

          <div>

            <h2 className="text-2xl font-bold">

              Workspace Members

            </h2>

            <p className="text-gray-500 mt-1">

              People who have access to this workspace.

            </p>

          </div>

          <button
            onClick={() =>
              setInviteOpen(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-semibold"
          >

            Invite Member

          </button>

        </div>

        {loading ? (

          <p>
            Loading team...
          </p>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left py-4">
                    Member
                  </th>

                  <th className="text-left py-4">
                    Email
                  </th>

                  <th className="text-left py-4">
                    Role
                  </th>

                  <th className="text-left py-4">
                    Joined
                  </th>

                </tr>

              </thead>

              <tbody>

                {members.map(
                  (member) => (

                    <tr
                      key={member.id}
                      className="border-b"
                    >

                      <td className="py-4">

                        <div className="flex items-center gap-3">

                          <UserCog
                            size={18}
                          />

                          <span>

                            {member
                              .profiles
                              ?.full_name ||
                              "Unnamed User"}

                          </span>

                        </div>

                      </td>

                      <td className="py-4">

                        <div className="flex items-center gap-2">

                          <Mail
                            size={16}
                          />

                          {member
                            .profiles
                            ?.email ||
                            "-"}

                        </div>

                      </td>

                      <td className="py-4">

                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">

                          {member.role}

                        </span>

                      </td>

                      <td className="py-4">

                        {new Date(
                          member.created_at
                        ).toLocaleDateString()}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8">

        <div className="mb-6">

          <h2 className="text-2xl font-bold">

            Pending Invitations

          </h2>

          <p className="text-gray-500 mt-1">

            Invitations waiting to be accepted.

          </p>

        </div>

        {pendingInvites.length === 0 ? (

          <p className="text-gray-500">

            No pending invitations.

          </p>

        ) : (

          <div className="space-y-4">

            {pendingInvites.map(
              (invite) => (

                <div
                  key={invite.id}
                  className="border rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>

                    <p className="font-semibold">

                      {invite.email}

                    </p>

                    <p className="text-sm text-gray-500">

                      {invite.role}

                    </p>

                  </div>

                  <div className="flex items-center gap-3">

                    <div className="text-sm text-gray-500">

                      Expires:

                      {" "}

                      {new Date(
                        invite.expires_at
                      ).toLocaleDateString()}

                    </div>

                    <div className="flex items-center gap-4">

                      <button
                        onClick={() =>
                          handleCopyInviteLink(
                            invite.token
                          )
                        }
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >

                        Copy Link

                      </button>

                      <button
                        onClick={() =>
                          handleCancelInvite(
                            invite.id
                          )
                        }
                        className="text-red-600 hover:text-red-700 font-medium"
                      >

                        Cancel

                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      <Dialog
        open={inviteOpen}
        onOpenChange={(open) => {

          setInviteOpen(open);

          if (!open) {

            setInviteEmail("");
            setInviteRole("accountant");
            setInviteLink("");
          }
        }}
      >

  <DialogContent>

    <DialogHeader>

      <DialogTitle>

        Invite Team Member

      </DialogTitle>

    </DialogHeader>

    <div className="space-y-4">

      <div>

        <label className="block text-sm font-medium mb-2">

          Email

        </label>

        <input
          type="email"
          value={inviteEmail}
          onChange={(e) =>
            setInviteEmail(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
          placeholder="john@example.com"
        />

      </div>

      <div>

        <label className="block text-sm font-medium mb-2">

          Role

        </label>

        <select
          value={inviteRole}
          onChange={(e) =>
            setInviteRole(
              e.target.value
            )
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3"
        >

          <option value="accountant">
            Accountant
          </option>

          <option value="assistant">
            Assistant
          </option>

        </select>

      </div>

      <button
        onClick={
          handleCreateInvite
        }
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
      >

        Create Invite

      </button>

      {inviteLink && (

        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm break-all">

          {inviteLink}

        </div>

        )}

    </div>

  </DialogContent>

</Dialog>

    </main>
  );
}