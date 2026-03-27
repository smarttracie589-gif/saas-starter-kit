import { Resend } from "resend";
import { SITE_CONFIG } from "@/lib/config";

export async function sendChangeAlert(userEmail, monitorName, changes) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
    console.log("⏭️ Skipping email (no Resend API key):", { userEmail, monitorName, changes });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const changeRows = changes.map(c => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 10px; font-weight: bold; color: #ffab40;">${c.field}</td>
        <td style="padding: 10px; color: #ff5252; text-decoration: line-through;">${c.old_value || "(empty)"}</td>
        <td style="padding: 10px; color: #00e676;">${c.new_value || "(empty)"}</td>
      </tr>
    `).join("");

    const { data, error } = await resend.emails.send({
      from: `${SITE_CONFIG.name} <onboarding@resend.dev>`,
      to: [userEmail],
      subject: `🚨 ALERT: Changes detected in ${monitorName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #6c5ce7;">🔔 ${SITE_CONFIG.name} Alert</h2>
          <p>Changes detected in your monitor: <strong>${monitorName}</strong></p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 10px; text-align: left;">Field</th>
                <th style="padding: 10px; text-align: left;">Previous</th>
                <th style="padding: 10px; text-align: left;">Current</th>
              </tr>
            </thead>
            <tbody>
              ${changeRows}
            </tbody>
          </table>

          <p>Log in to your dashboard to review these changes.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Automated alert from ${SITE_CONFIG.name}.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send catch error:", error);
    return { success: false, error };
  }
}
