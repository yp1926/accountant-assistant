import { NextResponse } from "next/server";

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

export async function GET(
  request: Request
) {

  try {

    const authHeader =
      request.headers.get(
        "authorization"
      );

    if (
      authHeader !==
      `Bearer ${process.env.CRON_SECRET}`
    ) {

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const today =
      new Date();

    const remindersResult =
      await supabase
        .from("reminders")
        .select("*")
        .neq(
          "status",
          "completed"
        );

    const reminders =
      remindersResult.data || [];

    let processed =
      0;

    let sent =
      0;

    for (const reminder of reminders) {

      processed++;

      const dueDate =
        new Date(
          reminder.due_date
        );

      const diffTime =
        dueDate.getTime() -
        today.getTime();

      const diffDays =
        Math.ceil(
          diffTime /
            (
              1000 *
              60 *
              60 *
              24
            )
        );

      let shouldSend =
        false;

      let updateField =
        "";

      let subject =
        "";

      if (
        diffDays === 7 &&
        !reminder.reminder_7_sent
      ) {

        shouldSend = true;

        updateField =
          "reminder_7_sent";

        subject =
          "Upcoming Reminder (7 Days Left)";
      }

      else if (
        diffDays === 1 &&
        !reminder.reminder_1_sent
      ) {

        shouldSend = true;

        updateField =
          "reminder_1_sent";

        subject =
          "Reminder Due Tomorrow";
      }

      else if (
        diffDays === 0 &&
        !reminder.due_reminder_sent
      ) {

        shouldSend = true;

        updateField =
          "due_reminder_sent";

        subject =
          "Reminder Due Today";
      }

      if (!shouldSend) {

        continue;
      }

      try {

        const {
          error: emailError,
        } =
          await resend.emails.send({
            from:
              "onboarding@resend.dev",

            to:
              reminder.client_email,

            subject,

            html: `
              <div style="font-family: Arial, sans-serif; padding: 24px;">

                <h2 style="color:#111827;">
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

                <p style="font-size:14px;color:#6B7280;">
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

        await supabase
          .from("reminders")
          .update({
            [updateField]:
              true,

            status:
              "sent",

            sent_count:
              (reminder.sent_count || 0) + 1,

            last_sent_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            reminder.id
          );

        sent++;

      } catch (error) {

        console.error(error);
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      sent,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}