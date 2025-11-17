export type Category = "conceptos" | "academico" | "shorts" | "podcasts";
export type CreatorType = "oficial" | "academico" | "divulgador";
export type Platform = "youtube" | "tiktok" | "instagram";

export interface Video {
  id: string;
  video_id: string; // ID o URL del video
  platform: Platform;
  category: Category;
  creator_name: string;
  creator_type: CreatorType;
  is_featured: boolean;
  // Metadata manual (tú la defines)
  title: string;
  description: string;
  thumbnail?: string; // Opcional
  embed_url?: string;
}
