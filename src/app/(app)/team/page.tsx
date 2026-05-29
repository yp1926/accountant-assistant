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

    async function fetchMembers() {

        try {
      
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
      
          console.log(
            "USER",
            user
          );
      
          console.log(
            "USER ERROR",
            userError
          );
      
          if (!user) {
      
            setLoading(false);
      
            return;
          }
      
          const {
            data: profile,
            error: profileError,
          } = await supabase
            .from("profiles")
            .select("workspace_id")
            .eq("id", user.id)
            .single();
      
          console.log(
            "PROFILE",
            profile
          );
      
          console.log(
            "PROFILE ERROR",
            profileError
          );
      
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
          
          console.log(
            "MEMBERS DATA",
            membersData
          );
          
          console.log(
            "MEMBERS ERROR",
            membersError
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
            error: profilesError,
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
          
          console.log(
            "PROFILES DATA",
            profilesData
          );
          
          console.log(
            "PROFILES ERROR",
            profilesError
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

  useEffect(() => {

    fetchMembers();

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

    </main>
  );
}