import { tradeInSchema, UPLOAD_LIMITS } from "@/lib/forms/schemas";
import { clientIp, json, rateLimit, rowsToHtml, sendMail } from "@/lib/forms/server";

export async function POST(req: Request) {
  if (!rateLimit(`tradein:${clientIp(req)}`, 3)) {
    return json(429, { error: "Trop de demandes envoyées. Réessayez dans quelques minutes." });
  }
  const form = await req.formData().catch(() => null);
  if (!form) return json(400, { error: "Requête invalide." });

  let raw: unknown = null;
  try {
    raw = JSON.parse(String(form.get("data") ?? "null"));
  } catch {}
  const parsed = tradeInSchema.safeParse(raw);
  if (!parsed.success) return json(400, { error: "Certains champs sont invalides." });
  const d = parsed.data;
  if (d.website) return json(200, { ok: true });

  const files = [...form.getAll("photos"), ...form.getAll("registration")].filter((f): f is File => f instanceof File);
  if (files.length > UPLOAD_LIMITS.maxFiles + 1) return json(400, { error: "Trop de fichiers." });
  let total = 0;
  for (const f of files) {
    total += f.size;
    if (!UPLOAD_LIMITS.accept.includes(f.type) || f.size > UPLOAD_LIMITS.maxFileBytes) {
      return json(400, { error: `Le fichier « ${f.name} » n'est pas accepté (images ou PDF, 4 Mo maximum).` });
    }
  }
  if (total > UPLOAD_LIMITS.maxTotalBytes) return json(413, { error: "Les fichiers dépassent 4 Mo au total." });

  const attachments = await Promise.all(
    files.map(async (f, i) => ({
      filename: `${String(i + 1).padStart(2, "0")}-${f.name.replace(/[^\w.-]+/g, "_").slice(0, 80)}`,
      content: Buffer.from(await f.arrayBuffer()),
    })),
  );

  const res = await sendMail({
    subject: `Reprise · ${d.brand} ${d.model} ${d.year} · ${d.mileageKm} km · ${d.name}`,
    replyTo: d.email,
    attachments,
    html: rowsToHtml("Demande de reprise / estimation", [
      ["Véhicule", `${d.brand} ${d.model}`],
      ["Année", d.year],
      ["Kilométrage", `${d.mileageKm} km`],
      ["Énergie", d.fuel],
      ["Boîte", d.transmission],
      ["État", d.condition],
      ["Souhait", d.wish],
      ["Nom", d.name],
      ["E-mail", d.email],
      ["Téléphone", d.phone],
      ["Pièces jointes", `${files.length} fichier(s)`],
    ]),
  });
  if (!res.ok) return json(502, { error: "L'envoi a échoué. Réessayez ou appelez-nous au +352 691 452 770." });
  return json(200, { ok: true });
}
