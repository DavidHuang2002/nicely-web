import { createMessage, generateUUID } from "@/lib/utils";
import { Chat } from "./basic";


export const untangleOpenner = "Hey, it’s good to see you here. 😊 What’s been on your mind lately? You can share whatever feels right—I’m here to listen and help make sense of things together.";


const untangleOpennerMessage = createMessage(untangleOpenner, "assistant");

export default function UntangleChat({
  chatId,
}: {
  chatId?: string;
}) {
  return <Chat 
    initialMessages={[untangleOpennerMessage]}
    apiRoute="/api/chat/untangle"
    chatId={chatId}
    />;
}
