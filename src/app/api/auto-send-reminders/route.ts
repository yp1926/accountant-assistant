import { Resend } from "resend";

import { createClient } from "@supabase/supabase-js";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    // Get all pending reminders
    const { data: reminders, error } =
      await supabase
        .from("reminders")
        .select("*")
        .eq("status", "pending");

    if (error) {

      return Response.json({
        success: false,
        error,
      });
    }

    const today = new Date();

    let processed = 0;

    for (const reminder of reminders) {

      // Fetch accountant profile
      const { data: profile } =
        await supabase
          .from("profiles")
          .select("business_name")
          .eq("id", reminder.user_id)
          .single();

      const businessName =
        profile?.business_name ||
        "Accountant AI";

      const dueDate = new Date(
        reminder.due_date
      );

      // Difference in days
      const diffTime =
        dueDate.getTime() -
        today.getTime();

      const diffDays = Math.ceil(
        diffTime /
        (1000 * 60 * 60 * 24)
      );

      let shouldSend = false;

      let emailType = "";

      let reminderLabel = "";

      // 7 DAY REMINDER
      if (
        diffDays === 7 &&
        !reminder.reminder_7_sent
      ) {

        shouldSend = true;

        emailType = "7_day";

        reminderLabel =
          "Upcoming Reminder";
      }

      // 1 DAY REMINDER
      else if (
        diffDays === 1 &&
        !reminder.reminder_1_sent
      ) {

        shouldSend = true;

        emailType = "1_day";

        reminderLabel =
          "Final Reminder";
      }

      // DUE DAY REMINDER
      else if (
        diffDays === 0 &&
        !reminder.due_reminder_sent
      ) {

        shouldSend = true;

        emailType = "due_day";

        reminderLabel =
          "Due Today";
      }

      if (!shouldSend) {
        continue;
      }

      // Send Email
      const { error: emailError } =
        await resend.emails.send({

          from: "onboarding@resend.dev",

          to: reminder.client_email,

          subject: `${businessName} — ${reminderLabel}`,

          html: `
            <div
              style="
                font-family: Arial, sans-serif;
                background: #f3f4f6;
                padding: 40px;
              "
            >

              <div
                style="
                  max-width: 650px;
                  margin: auto;
                  background: white;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
                "
              >

                <!-- Header -->
                <div
                  style="
                    background: #111827;
                    padding: 30px;
                    color: white;
                  "
                >

                  <h1
                    style="
                      margin: 0;
                      font-size: 28px;
                    "
                  >
                    ${businessName}
                  </h1>

                  <p
                    style="
                      margin-top: 10px;
                      color: #d1d5db;
                      font-size: 14px;
                    "
                  >
                    Automated Client Reminder
                  </p>

                </div>

                <!-- Content -->
                <div
                  style="
                    padding: 40px;
                  "
                >

                  <h2
                    style="
                      color: #111827;
                      margin-bottom: 20px;
                    "
                  >
                    ${reminderLabel}
                  </h2>

                  <p
                    style="
                      font-size: 16px;
                      color: #374151;
                      margin-bottom: 24px;
                    "
                  >
                    Hello ${reminder.client_name},
                  </p>

                  <div
                    style="
                      background: #f9fafb;
                      padding: 24px;
                      border-radius: 12px;
                      border-left: 5px solid #111827;
                    "
                  >

                    <p
                      style="
                        font-size: 16px;
                        color: #374151;
                        line-height: 1.7;
                        margin: 0;
                      "
                    >
                      ${reminder.message}
                    </p>

                  </div>

                  <!-- Due Date -->
                  <div
                    style="
                      margin-top: 30px;
                      padding: 24px;
                      background: #f3f4f6;
                      border-radius: 12px;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        font-size: 13px;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                      "
                    >
                      Due Date
                    </p>

                    <p
                      style="
                        margin-top: 10px;
                        font-size: 24px;
                        font-weight: bold;
                        color: #111827;
                      "
                    >
                      ${reminder.due_date}
                    </p>

                  </div>

                  <!-- Footer -->
                  <p
                    style="
                      margin-top: 40px;
                      font-size: 14px;
                      color: #9ca3af;
                      line-height: 1.6;
                    "
                  >
                    This automated reminder was sent by
                    ${businessName}.
                  </p>

                </div>

              </div>

            </div>
          `,
        });

      if (!emailError) {

        processed++;

        // Update correct tracking field
        if (emailType === "7_day") {

          await supabase
            .from("reminders")
            .update({
              reminder_7_sent: true,
            })
            .eq("id", reminder.id);
        }

        if (emailType === "1_day") {

          await supabase
            .from("reminders")
            .update({
              reminder_1_sent: true,
            })
            .eq("id", reminder.id);
        }

        if (emailType === "due_day") {

          await supabase
            .from("reminders")
            .update({
              due_reminder_sent: true,
              status: "sent",
            })
            .eq("id", reminder.id);
        }
      }
    }

    return Response.json({
      success: true,
      processed,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error,
    });
  }
}