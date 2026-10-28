import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const ogSize = { width: 1200, height: 630 };

const fontDir = path.join(process.cwd(), "src/assets/fonts");

async function fonts() {
  const [regular, italic, sans] = await Promise.all([
    readFile(path.join(fontDir, "BodoniModa-Medium.ttf")),
    readFile(path.join(fontDir, "BodoniModa-MediumItalic.ttf")),
    readFile(path.join(fontDir, "Geist-Medium.ttf")),
  ]);
  return [
    { name: "Bodoni", data: regular, style: "normal" as const, weight: 500 as const },
    { name: "BodoniItalic", data: italic, style: "normal" as const, weight: 500 as const },
    { name: "Geist", data: sans, style: "normal" as const, weight: 500 as const },
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
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#f6f6f3", color: "#131614", fontFamily: "Bodoni" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: photo ? 560 : "100%" }}>
          <div style={{ display: "flex", fontSize: 34, fontFamily: "Bodoni" }}>
            Smart&nbsp;<span style={{ fontFamily: "BodoniItalic" }}>Lease</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 4, fontFamily: "Geist", textTransform: "uppercase", color: "#1f4a37", marginBottom: 20 }}>
              {plain(eyebrow)}
            </div>
            <div style={{ fontSize: photo ? 56 : 76, lineHeight: 1.05, fontFamily: "Bodoni" }}>{plain(title)}</div>
            {details ? <div style={{ fontSize: 30, marginTop: 24, color: "#1f4a37", fontFamily: "Geist" }}>{plain(details)}</div> : null}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#5a5f5b", fontFamily: "Geist" }}>
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
