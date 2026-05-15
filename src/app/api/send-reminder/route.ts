import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const { to, subject, message } = body;

    const { data, error } =
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to,
        subject,
        html: `
          <div>
            <h2>${subject}</h2>
            <p>${message}</p>
          </div>
        `,
      });

    if (error) {
      console.error(error);

      return Response.json({
        success: false,
        error,
      });
    }

    return Response.json({
      success: true,
      data,
    });

  } catch (error) {

    console.error(error);

    return Response.json({
      success: false,
      error,
    });
  }
}