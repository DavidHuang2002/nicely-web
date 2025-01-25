import UntangleChat from "@/components/chat/untangle";

export default async function Page({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const chatId = (await params).chatId;

  return <UntangleChat chatId={chatId} />;
}
