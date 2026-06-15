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

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      userId,
      type,
      message,
      email,
    } = body;

    const {
      error: insertError,
    } = await supabase
      .from("feedback")
      .insert({
        user_id: userId || null,
        type,
        message,
      });

    if (insertError) {

      console.error(
        insertError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            insertError.message,
        },
        {
          status: 500,
        }
      );
    }

    await resend.emails.send({
      from:
        "onboarding@resend.dev",

      to:
        "yian.papazoglou@gmail.com",

      subject:
        `TaxNest Feedback - ${type}`,

      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px;">

          <h2>
            New TaxNest Feedback
          </h2>

          <p>
            <strong>User:</strong>
            ${email}
          </p>

          <p>
            <strong>Type:</strong>
            ${type}
          </p>

          <p>
            <strong>Message:</strong>
          </p>

          <p>
            ${message}
          </p>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
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