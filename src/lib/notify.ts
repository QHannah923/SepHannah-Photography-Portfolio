import "server-only";
import { db } from "./server";
import { studio, siteUrl } from "./studio";
export async function notifyInquiry(id: string) {
  const database = db();
  const { data: order, error } = await database
    .from("inquiries")
    .select(
      "id,name,email,phone,wechat,session_type,preferred_dates,location,message,style,package_id,film,contact_method,email_status,created_at",
    )
    .eq("id", id)
    .single();
  if (error || !order) return false;
  if (order.email_status === "sent") return true;
  let sent = false;
  let emailId: string | null = null;
  if (process.env.RESEND_API_KEY && process.env.STUDIO_FROM_EMAIL) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.RESEND_API_KEY,
          "Content-Type": "application/json",
          "Idempotency-Key": "studio-inquiry-" + id,
        },
        body: JSON.stringify({
          from: process.env.STUDIO_FROM_EMAIL,
          to: [process.env.STUDIO_OWNER_EMAIL || studio.email],
          ...(order.email ? { reply_to: order.email } : {}),
          subject: "New photography enquiry · " + order.session_type,
          text: [
            "New enquiry for SepHannah Studio",
            "Reference: " + id,
            "Name: " + order.name,
            "Email: " + order.email,
            "Phone: " + (order.phone || ""),
            "WeChat: " + (order.wechat || ""),
            "Preferred contact: " + order.contact_method,
            "Session: " + order.session_type,
            "Package: " + (order.package_id || "To discuss"),
            "Style: " + (order.style || "To discuss"),
            "35mm film: " + (order.film ? "Yes" : "No"),
            "Dates: " + (order.preferred_dates || "Flexible"),
            "Location: " + (order.location || ""),
            "Message: " + (order.message || ""),
            "Manage: " + siteUrl + "/admin",
          ].join("\n"),
        }),
        signal: AbortSignal.timeout(8000),
      });
      const result = await response.json();
      sent = response.ok && typeof result.id === "string";
      emailId = sent ? result.id : null;
    } catch {
      sent = false;
    }
  }
  const { error: updateError } = await database
    .from("inquiries")
    .update({ email_status: sent ? "sent" : "failed", email_id: emailId })
    .eq("id", id);
  if (updateError) console.error("Could not update notification state");
  return sent;
}
