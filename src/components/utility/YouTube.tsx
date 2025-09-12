import React from "react";

export type YoutubeProps = {
  url: string;
  title?: string;
  className?: string;
};

function parseTimeToSeconds(value: string): number {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  const match = trimmed.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
  if (!match) return 0;
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const mins = match[2] ? parseInt(match[2], 10) : 0;
  const secs = match[3] ? parseInt(match[3], 10) : 0;
  return hours * 3600 + mins * 60 + secs;
}

function extractIdAndStart(inputUrl: string): { id: string | null; start?: number } {
  try {
    const url = new URL(inputUrl);
    const host = url.hostname.replace(/^www\./, "");
    let id: string | null = null;

    if (host === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0] ?? null;
    } else if (host.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        id = url.searchParams.get("v");
      } else if (url.pathname.startsWith("/shorts/")) {
        id = url.pathname.split("/")[2] || null;
      }
    }

    if (!id) return { id: null };

    let start: number | undefined = undefined;
    const t = url.searchParams.get("t") || url.searchParams.get("start");
    if (t) {
      const seconds = parseTimeToSeconds(t);
      if (seconds > 0) start = seconds;
    }

    return { id, start };
  } catch {
    return { id: null };
  }
}

export function Youtube({ url, title = "YouTube video", className }: YoutubeProps) {
  const { id, start } = extractIdAndStart(url);
  if (!id) return null;

  const params = new URLSearchParams();
  if (typeof start === "number") params.set("start", String(start));

  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}${
    params.toString() ? `?${params.toString()}` : ""
  }`;

  return (
    <iframe
      className={className}
      width="100%"
      height="315"
      src={src}
      title={title}
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );
}

export default Youtube;


