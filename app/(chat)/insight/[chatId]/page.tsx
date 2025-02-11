import InsightChat from "@/components/notes/insight-chat";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ chatId: string }>;
  searchParams: Promise<{
    summary?: string;
    excerpt?: string;
    detail?: string;
  }>;
}) {
  const chatId = (await params).chatId;
  const awaitedSearchParams = await searchParams;

  const insight = awaitedSearchParams.summary
    ? {
        summary: awaitedSearchParams.summary,
        excerpt: awaitedSearchParams.excerpt || "",
        detail: awaitedSearchParams.detail || "",
      }
    : undefined;

  console.log("Insights", insight);

  return (
    <InsightChat
      chatId={chatId}
      insight={insight}
    />
  );
}
