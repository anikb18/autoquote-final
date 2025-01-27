import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  scheduledFor?: string; // ISO date string for scheduled sending
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const emailRequest: EmailRequest = await req.json();

    // If scheduledFor is in the future, store in database for later sending
    if (emailRequest.scheduledFor) {
      const scheduledTime = new Date(emailRequest.scheduledFor);
      if (scheduledTime > new Date()) {
        const { data: scheduledEmail, error } = await supabase
          .from("scheduled_emails")
          .insert([
            {
              to_addresses: emailRequest.to,
              subject: emailRequest.subject,
              html_content: emailRequest.html,
              scheduled_for: emailRequest.scheduledFor,
              status: "pending",
            },
          ]);

        if (error) throw error;

        return new Response(
          JSON.stringify({ message: "Email scheduled successfully" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    // Send email immediately if no scheduling or scheduled time is in the past
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AutoQuote24 <noreply@autoquote24.com>",
        to: emailRequest.to,
        subject: emailRequest.subject,
        html: emailRequest.html,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(error);
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-email function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
