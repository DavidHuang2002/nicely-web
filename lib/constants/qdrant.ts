export interface QdrantConfig {
  url: string;
  apiKey: string;
}

export const USER_PROFILE_COLLECTION = "nicely_user_profile";

export const QDRANT_CONFIG: QdrantConfig = {
  url: process.env.QDRANT_URL || "",
  apiKey: process.env.QDRANT_API_KEY || "",
};

export const ADA_VECTOR_SIZE = 1536; // Size for text-embedding-ada-002
