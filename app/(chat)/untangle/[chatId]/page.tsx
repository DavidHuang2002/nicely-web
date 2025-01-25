import UntangleChat from "@/components/chat/untangle";

export default function Page({ params }: { params: { chatId: string } }) {

  return <UntangleChat chatId={params.chatId} />;
}
