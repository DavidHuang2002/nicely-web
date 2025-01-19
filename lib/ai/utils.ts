import { Message } from "ai";

export const convertMessagesToStr = (messages: Message[]) => {
  return messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");
};

  