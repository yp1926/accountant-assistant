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

    // Get pending reminders
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

    // Loop reminders
    for (const reminder of reminders) {

      // Send email
      const { error: emailError } =
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: "yian.papazoglou@gmail.com",
          subject: `Reminder for ${reminder.client_name}`,
          html: `
            <div>
              <h2>Reminder</h2>
              <p>${reminder.message}</p>
            </div>
          `,
        });

      if (!emailError) {

        // Mark reminder as sent
        await supabase
          .from("reminders")
          .update({
            status: "sent",
          })
          .eq("id", reminder.id);
      }
    }

    return Response.json({
      success: true,
      processed: reminders.length,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error,
    });
  }
}