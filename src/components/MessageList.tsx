import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList = ({ messages = [], isTyping = false }: MessageListProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-md">
      <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
        <div className="flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center">
              <h3 className="text-lg font-medium text-gray-500">
                Welcome to the AI Chatbot
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Start a conversation by typing a message below
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${message.sender === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[80%]`}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/bottts/svg?seed=ai-assistant"
                        alt="AI"
                      />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                    <span className="text-xs opacity-70 block mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </motion.div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                        alt="User"
                      />
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex flex-row items-end gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/bottts/svg?seed=ai-assistant"
                    alt="AI"
                  />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl px-4 py-2 bg-muted text-foreground"
                >
                  <div className="flex space-x-1 items-center h-6">
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageList;
