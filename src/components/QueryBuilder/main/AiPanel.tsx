import React, { useState, useRef, useEffect } from "react";
import { FaArrowUp, FaChevronDown } from "react-icons/fa6";
import { LuBot } from "react-icons/lu";
import { useActiveConnection } from "@/hooks/useActiveConnection";
import { useQueryBuilderContext } from "@/context/QueryBuilderContext";
import { useRunQuery } from "@/hooks/useRunQuery";
import SaveQueryButton from "@/components/common/SaveQueryButton";
import { ExportButton } from "@/components/common/ExportButton";
import { Message } from "@/types/message";
import { CodeBlock } from "@/components/ui/code-block";
import { FaChartArea, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type ResponseType = "sql" | "result" | "explanation" | "schema";

interface ResultMessage extends Message {
  responseType?: ResponseType;
  result?: any[];
  sql?: string;
  schemaData?: any;
}

export const AiPanel: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ResultMessage[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      responseType: "explanation",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { schema, selectedDatabase, fetchFullSchema } = useActiveConnection();
  const { setSql } = useQueryBuilderContext();
  const { runQuery } = useRunQuery();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight >= 10);
  };

  const determineResponseType = (
    userMessage: string,
    aiResponse: string
  ): ResponseType => {
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();

    // Check if it's a schema request
    if (
      lowerMessage.includes("structure") ||
      lowerMessage.includes("schema") ||
      lowerMessage.includes("table") ||
      lowerMessage.includes("column")
    ) {
      return "schema";
    }

    // Check if it's a SQL query
    if (
      lowerResponse.includes("select") ||
      lowerResponse.includes("insert") ||
      lowerResponse.includes("update") ||
      lowerResponse.includes("delete")
    ) {
      return "sql";
    }

    // Default to explanation
    return "explanation";
  };

  const simulateAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    try {
      await fetchFullSchema(selectedDatabase!);

      const schemaForSelectedDb = schema?.[selectedDatabase || ""] || {};
      const formattedSchema = Object.entries(schemaForSelectedDb)
        .map(
          ([table, columns]) =>
            `${table}(${columns.map((col) => col.Field).join(", ")})`
        )
        .join("\n");

      const aiResponse = await window.api.aiGenerateSQL(
        userMessage,
        formattedSchema
      );
      const responseType = determineResponseType(userMessage, aiResponse);

      let result: any[] = [];
      let finalResponseType = responseType;

      if (responseType === "sql" && selectedDatabase) {
        try {
          result = (await runQuery(selectedDatabase, aiResponse)) || [];
        } catch (err) {
          result = [{ Error: "⚠️ Query execution failed." }];
        }
      }

      if (responseType === "schema") {
        const schemaData = schemaForSelectedDb;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date(),
            responseType: "schema",
            schemaData,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: aiResponse,
            isUser: false,
            timestamp: new Date(),
            responseType: finalResponseType,
            result,
            sql: responseType === "sql" ? aiResponse : undefined,
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Failed to generate response.",
          isUser: false,
          timestamp: new Date(),
          responseType: "explanation",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleRunQuery = async (sql: string) => {
    if (!selectedDatabase || !sql) return;

    setIsLoading(true);
    try {
      const result = (await runQuery(selectedDatabase, sql)) || [];

      // Add a new result message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Query executed successfully",
          isUser: false,
          timestamp: new Date(),
          responseType: "result",
          result,
          sql,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Query execution failed.",
          isUser: false,
          timestamp: new Date(),
          responseType: "explanation",
        },
      ]);
    }
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
    await simulateAIResponse(inputText);
  };

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    const minHeight = 44;
    const maxHeight = 120;
    textarea.style.height = `${Math.min(
      Math.max(textarea.scrollHeight, minHeight),
      maxHeight
    )}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [inputText]);

  const renderMessageActions = (message: ResultMessage) => {
    switch (message.responseType) {
      case "sql":
        return (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => message.sql && handleRunQuery(message.sql)}
              className="btn-primary flex items-center gap-2 text-xs"
              disabled={isLoading}
            >
              <FaPlay />
              Run Query
            </button>
            <SaveQueryButton sql={message.text} />
          </div>
        );

      case "result":
        return (
          <div className="flex gap-2 mt-3">
            <ExportButton data={message.result || []} filename="query_result" />
            <button
              className="btn-primary flex items-center gap-2 text-xs"
              onClick={() => {
                navigate("/chart", {
                  state: { data: message.result },
                });
              }}
            >
              <FaChartArea />
              Generate Chart
            </button>
          </div>
        );

      case "schema":
        return (
          <div className="flex gap-2 mt-3">
            <button className="btn-primary text-xs w-full" onClick={() => {}}>
              View Full Schema
            </button>
          </div>
        );

      case "explanation":
      default:
        return null;
    }
  };

  const renderMessageContent = (message: ResultMessage) => {
    if (message.responseType === "sql") {
      return (
        <CodeBlock
          language="sql"
          filename="Generated SQL"
          code={message.text}
        />
      );
    }

    return (
      <p className="text-sm leading-relaxed whitespace-pre-wrap">
        {message.text}
      </p>
    );
  };

  return (
    <div className="w-full h-[70vh] min-h-[400px] relative">
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
                className={`flex items-start space-x-3 max-w-full lg:max-w-9/10 ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                {!message.isUser && (
                  <div className="rounded-full flex items-center justify-center flex-shrink-0 -translate-y-[10px]">
                    <LuBot className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <div
                  className={`rounded-xl p-3 shadow-sm overflow-auto ${
                    message.isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-50 text-gray-700 rounded-tl-none border border-gray-300"
                  }`}
                >
                  {renderMessageContent(message)}

                  {/* Render query results table for result type */}
                  {message.responseType === "result" &&
                    message.result &&
                    message.result.length > 0 && (
                      <div className="mt-3 border border-gray-300 rounded-md overflow-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-blue-100 text-gray-700">
                            <tr>
                              {Object.keys(message.result[0]).map((key) => (
                                <th
                                  key={key}
                                  className="px-3 py-2 font-semibold"
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {message.result.map((row, i) => (
                              <tr
                                key={i}
                                className="odd:bg-white even:bg-gray-50"
                              >
                                {Object.values(row).map((value, j) => (
                                  <td key={j} className="px-3 py-2">
                                    {String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  <p className="text-xs mt-1 text-gray-300">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {/* Render action buttons */}
                  {!message.isUser && renderMessageActions(message)}
                </div>
              </div>
            </div>
          ))}

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

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute w-full bottom-0 flex gap-3 bg-white p-2">
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute -top-10 left-1/2 text-black p-3 rounded-lg border border-gray-200 shadow-lg transition-all -translate-x-1/2 hover:scale-105 z-20 backdrop-blur-sm cursor-pointer"
          >
            <FaChevronDown className="w-3 h-3" />
          </button>
        )}
        <textarea
          ref={textareaRef}
          placeholder="Ask anything to AI..."
          className="flex-grow px-5 py-2 border rounded-lg bubble-wrap focus:outline-0 opacity-75 focus:opacity-100 placeholder:text-gray-500 bg-gray-50/10"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            !e.shiftKey &&
            (e.preventDefault(), handleSendMessage())
          }
          rows={1}
          style={{ minHeight: "44px", maxHeight: "120px", lineHeight: "1.5" }}
        />
        <button
          className="inverted-bubble-wrap flex justify-center items-center w-10 h-10 rounded-full cursor-pointer"
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
        >
          <FaArrowUp />
        </button>
      </div>
    </div>
  );
};
