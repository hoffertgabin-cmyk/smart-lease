import Image from "next/image";
import { site } from "@/lib/site";

type Media = { id: string; caption?: string; media_url: string; permalink: string; media_type: string; thumbnail_url?: string };

async function fetchMedia(): Promise<Media[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];
  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,media_type,thumbnail_url&limit=6&access_token=${token}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: Media[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

/** Latest Instagram posts, fetched server-side (no third-party script, no cookie). */
export async function InstagramFeed() {
  const media = await fetchMedia();
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Instagram</p>
          <h2 className="mt-3 text-display-lg">
            Les arrivages, <em>en images</em>
          </h2>
        </div>
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="font-medium underline decoration-accent underline-offset-4">
          Suivre @smart_lease
        </a>
      </div>
      {media.length > 0 ? (
        <ul className="grid grid-cols-2 gap-2 md:grid-cols-6">
          {media.slice(0, 6).map((m) => (
            <li key={m.id}>
              <a href={m.permalink} target="_blank" rel="noopener noreferrer" className="relative block aspect-square overflow-hidden bg-studio">
                <Image
                  src={m.media_type === "VIDEO" ? (m.thumbnail_url ?? m.media_url) : m.media_url}
                  alt={m.caption?.slice(0, 120) || "Publication Instagram Smart Lease"}
                  fill
                  sizes="(min-width: 768px) 16vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-line bg-paper p-6 text-sm text-muted">
          <span className="todo mr-2">TODO</span>
          Renseigner <code>INSTAGRAM_ACCESS_TOKEN</code> pour afficher les 6 dernières publications de @smart_lease.
        </p>
      )}
    </div>
  );
}
