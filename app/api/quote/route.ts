import { Resend } from "resend";
import site from "@/data/site.json";
import { getDict } from "@/lib/i18n";
import { quoteMessage } from "@/lib/quote";
import { escapeHtml, parseLang, parseQuote } from "@/lib/validate";

// E-mails envoyés seulement si RESEND_API_KEY et QUOTE_NOTIFY_EMAIL sont configurés (Vercel → Environment Variables).
// RESEND_FROM doit utiliser un domaine vérifié dans Resend, ex. « Mor & Cinnamon <devis@domaine.co.il> ».
// La demande part de toute façon sur WhatsApp côté client : l'e-mail en est la copie.

const html = (text: string, rtl: boolean) =>
  `<div dir="${rtl ? "rtl" : "ltr"}" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2E2522;white-space:pre-wrap">${escapeHtml(text).replace(/\*(.+?)\*/g, "<strong>$1</strong>")}</div>`;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const lang = parseLang(body?.lang);
  const quote = parseQuote(body?.quote, lang);
  if (!body || !quote) return Response.json({ ok: false }, { status: 400 });
  const d = getDict(lang);
  const ref = typeof body.ref === "string" ? body.ref.slice(0, 20) : undefined;

  const key = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_NOTIFY_EMAIL;
  if (!key || !to) return Response.json({ ok: true, emailed: false });

  const rtl = lang === "he";
  const text = quoteMessage(quote, lang, d, ref);
  const resend = new Resend(key);
  const from = process.env.RESEND_FROM ?? "Mor & Cinnamon <onboarding@resend.dev>";
  try {
    await resend.emails.send({ from, to, subject: `${d.email.subjectBusiness}${ref ? ` · ${ref}` : ""}`, html: html(text, rtl), text, replyTo: quote.email || undefined });
    if (quote.email) {
      const clientText = `${d.email.intro}\n\n${text}\n\nWhatsApp: ${site.phoneIntl}\n${site.instagram}`;
      await resend.emails.send({ from, to: quote.email, replyTo: to, subject: d.email.subjectClient, html: html(clientText, rtl), text: clientText });
    }
    return Response.json({ ok: true, emailed: true });
  } catch {
    return Response.json({ ok: true, emailed: false });
  }
}
