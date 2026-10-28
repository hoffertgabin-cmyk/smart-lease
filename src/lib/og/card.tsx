import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "src/assets/fonts");

async function fonts() {
  const [display, sans] = await Promise.all([
    readFile(path.join(fontDir, "Manrope-ExtraBold.ttf")),
    readFile(path.join(fontDir, "Inter-Medium.ttf")),
  ]);
  return [
    { name: "Manrope", data: display, style: "normal" as const, weight: 800 as const },
    { name: "Inter", data: sans, style: "normal" as const, weight: 500 as const },
  ];
}

// Satori fonts lack the narrow no-break space used by Intl in French.
const plain = (s: string) => s.replace(/[  ]/g, " ");

/** Shared Open Graph card in the « Maison » style: wordmark, title, optional details and photo. */
export async function ogCard({
  eyebrow,
  title,
  details,
  photo,
}: {
  eyebrow: string;
  title: string;
  details?: string;
  photo?: string; // data URL (JPEG/PNG)
}) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0b1f3a", color: "#ffffff", fontFamily: "Inter" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: photo ? 560 : "100%" }}>
          <div style={{ display: "flex", fontSize: 36, fontFamily: "Manrope", letterSpacing: -1 }}>
            Smart<span style={{ color: "#ffb547" }}>Lease</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#ffb547", marginBottom: 20 }}>
              {plain(eyebrow)}
            </div>
            <div style={{ fontSize: photo ? 52 : 68, lineHeight: 1.1, fontFamily: "Manrope", letterSpacing: -1.5 }}>{plain(title)}</div>
            {details ? <div style={{ fontSize: 32, marginTop: 24, color: "#ffffff" }}>{plain(details)}</div> : null}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#c2cddd" }}>
            {`${site.address.street}, ${site.address.postalCode} ${site.address.city}  ·  ${site.phone.display}`}
          </div>
        </div>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" width={640} height={630} style={{ objectFit: "cover" }} />
        ) : null}
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
