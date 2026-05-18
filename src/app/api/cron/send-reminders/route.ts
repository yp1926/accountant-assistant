import { Resend } from "resend";

import { createClient } from "@supabase/supabase-js";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

const supabase =
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function GET() {

  try {

    // Get today's date
    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    // Fetch pending reminders due today or earlier
    const {
      data: reminders,
      error,
    } = await supabase
      .from("reminders")
      .select("*")
      .eq("status", "pending")
      .lte("due_date", today);

    if (error) {

      console.error(error);

      return Response.json({
        success: false,
        error,
      });
    }

    let sentCount = 0;

    // Process reminders
    for (const reminder of reminders || []) {

      try {

        // Send email
        const {
          error: emailError,
        } =
          await resend.emails.send({
            from:
              "onboarding@resend.dev",

            to:
              reminder.client_email,

            subject:
              `Reminder for ${reminder.client_name}`,

            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">

                <h2 style="color: #111827;">
                  TaxNest Reminder
                </h2>

                <p>
                  Hello ${reminder.client_name},
                </p>

                <p>
                  ${reminder.message}
                </p>

                <p>
                  Due Date:
                  <strong>
                    ${reminder.due_date}
                  </strong>
                </p>

                <br />

                <p style="color: #6B7280; font-size: 14px;">
                  Sent automatically by TaxNest.
                </p>

              </div>
            `,
          });

        if (emailError) {

          console.error(
            emailError
          );

          continue;
        }

        // Update reminder status
        await supabase
          .from("reminders")
          .update({
            status: "sent",
          })
          .eq("id", reminder.id);

        sentCount++;

      } catch (err) {

        console.error(err);
      }
    }

    return Response.json({
      success: true,
      processed:
        reminders?.length || 0,
      sent: sentCount,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      error,
    });
  }
}