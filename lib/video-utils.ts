import { Platform } from "@/interfaces/aprende";

export function getEmbedUrl(videoId: string, platform: Platform): string {
  switch (platform) {
    case "youtube":
      return `https://www.youtube.com/embed/${videoId}`;

    case "tiktok":
      return `https://www.tiktok.com/player/v1/${videoId}`;

    case "instagram":
      return `https://www.instagram.com/p/${videoId}/embed`;

    default:
      return "";
  }
}

export function getThumbnail(videoId: string, platform: Platform): string {
  switch (platform) {
    case "youtube":
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    case "tiktok":
    case "instagram":
      return "/thumbnails/default-video.jpg";

    default:
      return "/api/placeholder/400/225";
  }
}

export async function getTikTokThumbnail(videoId: string): Promise<string> {
  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@user/video/${videoId}`;
    const response = await fetch(oembedUrl);
    const data = await response.json();
    return data.thumbnail_url || "/thumbnails/tiktok-default.jpg";
  } catch (error) {
    console.error("Error fetching TikTok thumbnail:", error);
    return "/thumbnails/tiktok-default.jpg";
  }
}
