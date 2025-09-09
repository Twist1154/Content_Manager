// lib/notifications/email.ts

// Minimal email sending abstraction to keep provider pluggable
// Prefer configuring NOTIFY_EMAIL_API_URL and NOTIFY_EMAIL_API_KEY to forward
// email notifications to your provider/webhook. See README for details.

interface SendBulkEmailPayload {
  to: string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendBulkEmail({ to, subject, html, from }: SendBulkEmailPayload): Promise<{ success: boolean; error?: string }>{
  try {
    const apiUrl = process.env.NOTIFY_EMAIL_API_URL;
    const apiKey = process.env.NOTIFY_EMAIL_API_KEY;
    const defaultFrom = process.env.NOTIFY_EMAIL_FROM || 'no-reply@uploader.local';

    // If no provider is configured, do a safe no-op with a log so uploads are not blocked in dev
    if (!apiUrl || !apiKey) {
      console.warn('[notify-email] Email provider not configured. Skipping email send.');
      console.info('[notify-email] Intended recipients:', to);
      return { success: true };
    }

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ to, subject, html, from: from || defaultFrom })
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[notify-email] Provider returned error:', res.status, text);
      return { success: false, error: `Email API error: ${res.status}` };
    }

    return { success: true };
  } catch (err: any) {
    console.error('[notify-email] Unexpected error while sending email:', err);
    return { success: false, error: err?.message || 'Unknown error' };
  }
}
