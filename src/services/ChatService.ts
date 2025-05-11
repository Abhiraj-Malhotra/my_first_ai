import { useState } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  success: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Export the sendMessage function as a named export
export const sendMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_URL}/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      message: data.response || "Sorry, I couldn't process your request.",
      success: true,
    };
  } catch (error) {
    console.error("Error sending message to API:", error);
    return {
      message: "Sorry, there was an error connecting to the chatbot service.",
      success: false,
    };
  }
};

export const ChatService = {
  /**
   * Sends a message to the AI chatbot API and returns the response
   * @param message The user's message to send to the AI
   * @returns Promise with the AI's response
   */
  sendMessage,

  /**
   * Generates a unique ID for messages
   * @returns A unique string ID
   */
  generateMessageId: (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },

  /**
   * Creates a new message object
   * @param content The message content
   * @param sender Who sent the message ('user' or 'ai')
   * @returns A formatted message object
   */
  createMessage: (content: string, sender: "user" | "ai"): Message => {
    return {
      id: ChatService.generateMessageId(),
      content,
      sender,
      timestamp: new Date(),
    };
  },

  /**
   * Custom hook for managing chat state
   * @returns Chat state and methods
   */
  useChat: () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendUserMessage = async (content: string) => {
      if (!content.trim()) return;

      // Add user message to chat
      const userMessage = ChatService.createMessage(content, "user");
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Send to API and get response
        const response = await sendMessage(content);

        if (response.success) {
          // Add AI response to chat
          const aiMessage = ChatService.createMessage(response.message, "ai");
          setMessages((prev) => [...prev, aiMessage]);
        } else {
          setError("Failed to get response from chatbot");
        }
      } catch (err) {
        setError("An error occurred while sending your message");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const clearChat = () => {
      setMessages([]);
      setError(null);
    };

    return {
      messages,
      isLoading,
      error,
      sendMessage: sendUserMessage,
      clearChat,
    };
  },
};

export default ChatService;
