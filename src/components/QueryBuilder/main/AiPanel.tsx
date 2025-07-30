import { FaArrowUp, FaChevronDown } from "react-icons/fa6";
import { LuBot } from "react-icons/lu";
import React, { useState, useRef, useEffect } from "react";
import { Message } from "@/types/message";

export const AiPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Force scroll to bottom (for button click)
  const scrollToBottomInstant = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // Check if user is near bottom to show/hide scroll button
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      setShowScrollButton(!isAtBottom);
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate AI response
  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    );

    setMessages((prev) => [
      ...prev,
      {
        id: "2",
        text: "OK",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    await simulateAIResponse(inputText);
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Set height based on scrollHeight, but respect min and max constraints
    const minHeight = 44; // minHeight in pixels
    const maxHeight = 120; // maxHeight in pixels

    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    );
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [inputText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-[70vh] min-h-[400px] relative">
      {/* Message Container */}
      <div>
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto absolute top-0 scrollbar-hide pt-4 pb-14 space-y-3 w-full"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-3 max-w-full lg:max-w-2/3 ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                {!message.isUser && (
                  <div className="rounded-full flex items-center justify-center flex-shrink-0 -translate-y-[10px]">
                    <LuBot className="w-5 h-5 text-gray-600" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`rounded-xl p-3 shadow-sm overflow-auto ${
                    message.isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-50 text-gray-700 rounded-tl-none border-gray-300 border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isUser ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="rounded-full flex items-center justify-center -translate-y-[10px]">
                  <LuBot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-300 rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute w-full bottom-0 flex gap-3 bg-white p-2">
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <button
            onClick={scrollToBottomInstant}
            className="absolute -top-10 left-1/2 text-black p-2 rounded-lg border border-gray-200 shadow-lg transition-all -translate-x-1/2 hover:scale-105 z-20 backdrop-blur-sm"
          >
            <FaChevronDown className="w-3 h-3" />
          </button>
        )}
        <textarea
          ref={textareaRef}
          placeholder="Ask anything to AI..."
          className="flex-grow px-5 py-2 border rounded-lg bubble-wrap focus:outline-0 opacity-75 focus:opacity-100 placeholder:text-gray-500 bg-gray-50/10"
          value={inputText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          rows={1}
          style={{ minHeight: "44px", maxHeight: "120px", lineHeight: "1.5" }}
        />
        <button
          className="inverted-bubble-wrap flex justify-center items-center w-10 h-10 rounded-full opacity-100 hover:shadow-sm cursor-pointer focus:text-gray-800"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};
