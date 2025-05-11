import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { sendMessage } from "../services/ChatService";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  title?: string;
  initialMessages?: Message[];
}

const ChatInterface = ({
  title = "AI Assistant",
  initialMessages = [],
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Generate a unique ID for the message
    const userMessageId = Date.now().toString();

    // Add user message to chat
    const userMessage: Message = {
      id: userMessageId,
      content: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to backend and get response
      const response = await sendMessage(message);

      // Add AI response to chat
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content:
          response.message || "I'm sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content:
          "Sorry, there was an error processing your request. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col bg-background">
      <CardHeader className="border-b">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>{title}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="text-xs"
          >
            Clear Chat
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden p-0 relative">
        <div className="h-full overflow-y-auto p-4">
          <MessageList messages={messages} isTyping={isLoading} />
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t p-2">
        <MessageInput
          value={inputValue}
          onChange={handleInputChange}
          onSend={handleSendMessage}
          isLoading={isLoading}
          placeholder="Type your message here..."
        />
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
