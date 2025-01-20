import { QdrantClient } from "@qdrant/js-client-rest";
import { StoredReflectionPoint } from "../../models/reflection";
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
  reflection: StoredReflectionPoint,
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

export const searchReflections = async (
  query: number[],
  userId: string,
  topN: number,
  filterType: "all" | "goal" | "struggle" | "insight" | "next_step"
) => {
  // Build filter condition
  const filter: any = {
    must: [
      {
        key: "user_id",
        match: { value: userId },
      },
    ],
  };

  // Add type filter if not "all"
  if (filterType !== "all") {
    filter.must.push({
      key: "type",
      match: { value: filterType },
    });
  }

  // Search in Qdrant
  const searchResult = await client.search(USER_PROFILE_COLLECTION, {
    vector: query,
    limit: topN,
    filter: filter,
    with_payload: true, // Include all payload fields
    score_threshold: 0.7, // Only return results with >0.7 similarity
  });

  return searchResult;
};

// TODO: problematic
// export const searchRecentGoalReflections = async (
//   userId: string,
//   topN: number
// ) => {
//   const filter = {
//     must: [
//       {
//         key: "user_id",
//         match: { value: userId },
//       },
//       {
//         key: "type",
//         match: { value: "goal" },
//       },
//     ],
//   };

//   // Search in Qdrant with sorting by timestamp
//   const searchResult = await client.scroll(USER_PROFILE_COLLECTION, {
//     filter,
//     limit: topN,
//     with_payload: true,
//     with_vector: false,

//     // Sort by timestamp in descending order
//     order_by: {
//       key: "timestamp",
//       direction: "desc",
//     },
//   });

//   return searchResult.points;
// };
