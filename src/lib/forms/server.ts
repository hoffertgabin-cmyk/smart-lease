import "server-only";
import { Resend } from "resend";
import { site } from "@/lib/site";

// Best-effort in-memory limiter: protects each serverless instance. For strict limits across
// instances, swap for Upstash Ratelimit (see README).
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return false;
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function rowsToHtml(title: string, rows: [string, string | number | undefined | null][]) {
  const body = rows
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#5a5f5b;vertical-align:top;white-space:nowrap">${escape(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${escape(String(v))}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;font-size:15px;color:#131614"><h2 style="font-weight:600">${escape(title)}</h2><table>${body}</table></div>`;
}

export async function sendMail({
  subject,
  html,
  replyTo,
  attachments,
}: {
  subject: string;
  html: string;
  replyTo: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[mail:dev] ${subject}`);
      return { ok: true as const };
    }
    console.error("RESEND_API_KEY manquante");
    return { ok: false as const };
  }
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM ?? "Site Smart Lease <site@smartlease.lu>",
    to: process.env.MAIL_TO ?? site.email,
    replyTo,
    subject,
    html,
    attachments,
  });
  if (error) {
    console.error("Resend error", error);
    return { ok: false as const };
  }
  return { ok: true as const };
}

export function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status });
}
