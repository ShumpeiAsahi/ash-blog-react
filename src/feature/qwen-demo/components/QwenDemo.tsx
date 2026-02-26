import React, { useState, useCallback, useRef, useEffect } from "react";
import "./QwenDemo.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QwenDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../worker/qwenWorker.ts", import.meta.url),
      { type: "module" }
    );

    workerRef.current.onmessage = (e) => {
      const { type, text, status } = e.data;

      if (type === "status") {
        setLoadingStatus(status);
        if (status === "Model loaded successfully!") {
          setIsModelLoaded(true);
        }
      } else if (type === "stream") {
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            return [
              ...prev.slice(0, -1),
              { ...lastMsg, content: lastMsg.content + text },
            ];
          }
          return [...prev, { role: "assistant", content: text }];
        });
      } else if (type === "done") {
        setIsLoading(false);
      } else if (type === "error") {
        setLoadingStatus(`Error: ${e.data.error}`);
        setIsLoading(false);
      }
    };

    workerRef.current.postMessage({ type: "load" });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading || !isModelLoaded) return;

      const userMessage: Message = { role: "user", content: input.trim() };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setIsLoading(true);

      workerRef.current?.postMessage({
        type: "generate",
        messages: newMessages,
      });
    },
    [input, isLoading, isModelLoaded, messages]
  );

  return (
    <div className="qwen-demo">
      <h1>Qwen3 0.6B On-Browser Demo</h1>
      <p className="description">
        This demo runs Qwen3 0.6B entirely in your browser using Transformers.js
        and WebGPU/WASM.
      </p>

      {!isModelLoaded && (
        <div className="loading-status">
          <div className="spinner"></div>
          <p>{loadingStatus || "Initializing..."}</p>
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.length === 0 && isModelLoaded && (
            <p className="placeholder">Ask me anything!</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-role">
                {msg.role === "user" ? "You" : "Qwen3"}
              </div>
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="message assistant">
              <div className="message-role">Qwen3</div>
              <div className="message-content typing">...</div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isModelLoaded ? "Type your message..." : "Loading model..."}
            disabled={isLoading || !isModelLoaded}
          />
          <button type="submit" disabled={isLoading || !isModelLoaded || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default QwenDemo;
