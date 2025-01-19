import { QdrantClient } from "@qdrant/js-client-rest";
import { ReflectionPoint } from "../../models/reflection";
import {
  QDRANT_CONFIG,
  ADA_VECTOR_SIZE,
  USER_PROFILE_COLLECTION,
} from "../constants/qdrant";
import { createHash } from "crypto";

const client = new QdrantClient({
  url: QDRANT_CONFIG.url,
  apiKey: QDRANT_CONFIG.apiKey,
});

const generatePointId = (summary: string): number => {
  const hash = createHash("sha256").update(summary).digest("hex");
  // Take first 12 characters of hex (48 bits, safely within Number.MAX_SAFE_INTEGER)
  return parseInt(hash.slice(0, 12), 16);
};

export const initializeCollectionIfNotExist = async (): Promise<void> => {
  const { exists } = await client.collectionExists(USER_PROFILE_COLLECTION);
  console.log("exists", exists);
  if (!exists) {
    console.log("creating collection", USER_PROFILE_COLLECTION);
    await client.createCollection(USER_PROFILE_COLLECTION, {
      vectors: {
        size: ADA_VECTOR_SIZE,
        distance: "Cosine",
      },
    });
  }
};

export const upsertReflection = async (
  reflection: ReflectionPoint,
  embedding: number[]
): Promise<void> => {
  // init if not exists
  await initializeCollectionIfNotExist();

  await client.upsert(USER_PROFILE_COLLECTION, {
    points: [
      {
        id: generatePointId(reflection.summary),
        vector: embedding,
        payload: {
          ...reflection,
        },
      },
    ],
  });
};
