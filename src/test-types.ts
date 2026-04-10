import { useChat } from "@ai-sdk/react";
const { messages, append, isLoading } = useChat();
console.log(messages, append, isLoading);
