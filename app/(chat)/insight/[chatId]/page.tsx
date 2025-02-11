import InsightChat from "@/components/notes/insight-chat";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ chatId: string }>;
  searchParams: { summary?: string; excerpt?: string; detail?: string };
}) {
  const chatId = (await params).chatId;
  const insight = searchParams.summary
    ? {
        summary: searchParams.summary,
        excerpt: searchParams.excerpt || "",
        detail: searchParams.detail || "",
      }
    : undefined;

  console.log("Insights", insight);

  return (
    <InsightChat
      chatId={chatId}
      insight={insight}
      initialButtonText="Let's get started!"
    />
  );
}
