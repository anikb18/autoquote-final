import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  newsletterId: string;
  filterCriteria?: Record<string, any>;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newsletterId, filterCriteria } = await req.json() as NewsletterRequest;

    // Get newsletter content
    const { data: newsletter, error: newsletterError } = await supabase
      .from("newsletters")
      .select("*")
      .eq("id", newsletterId)
      .single();

    if (newsletterError || !newsletter) {
      throw new Error("Newsletter not found");
    }

    // Get subscribers based on filter criteria
    let query = supabase.from("newsletter_subscribers").select("*").eq("status", "active");

    if (filterCriteria) {
      // Apply additional filters based on filterCriteria
      // This is where you can add complex filtering logic
      console.log("Applying filters:", filterCriteria);
    }

    const { data: subscribers, error: subscribersError } = await query;

    if (subscribersError) {
      throw new Error("Error fetching subscribers");
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Send emails in batches of 10
    const batchSize = 10;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (subscriber) => {
        try {
          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "newsletter@yourdomain.com",
              to: subscriber.email,
              subject: newsletter.title,
              html: newsletter.content,
            }),
          });

          const result = await response.json();

          // Record the send attempt
          await supabase.from("newsletter_sends").insert({
            newsletter_id: newsletterId,
            subscriber_id: subscriber.id,
            status: response.ok ? "sent" : "failed",
            error_message: response.ok ? null : JSON.stringify(result),
            metadata: { resend_id: result.id }
          });

        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          await supabase.from("newsletter_sends").insert({
            newsletter_id: newsletterId,
            subscriber_id: subscriber.id,
            status: "failed",
            error_message: error.message
          });
        }
      }));
    }

    // Update newsletter status
    await supabase
      .from("newsletters")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", newsletterId);

    return new Response(
      JSON.stringify({ success: true, message: "Newsletter sent successfully" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
};

serve(handler);