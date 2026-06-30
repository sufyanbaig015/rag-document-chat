import { useState } from "react";

import { uploadDocument, askQuestion } from "../api/ragApi.js";
import ChatLayout from "../components/layout/ChatLayout.jsx";

import "./HomePage.css";

function createId() {
  return crypto.randomUUID();
}

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [indexedDocs, setIndexedDocs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError("Please choose a file from the sidebar first.");
      return;
    }

    try {
      setError("");
      setUploadMessage("");
      setLoadingUpload(true);

      const result = await uploadDocument(file);

      setUploadMessage(`${result.message} (${result.chunks} chunks)`);
      setIndexedDocs((prev) =>
        prev.includes(result.source) ? prev : [...prev, result.source]
      );

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "system",
          content: `Document "${result.source}" indexed successfully with ${result.chunks} chunks. You can now ask questions about it.`
        }
      ]);

      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoadingUpload(false);
    }
  }

  async function handleAsk(e) {
    e.preventDefault();

    const trimmed = question.trim();
    if (!trimmed || loadingChat) return;

    const userMessage = {
      id: createId(),
      role: "user",
      content: trimmed
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setError("");
    setLoadingChat(true);

    try {
      const result = await askQuestion(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: result.answer,
          sources: result.sources || []
        }
      ]);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoadingChat(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setQuestion("");
    setError("");
    setUploadMessage("");
    setSidebarOpen(false);
  }

  function handleSuggestionClick(text) {
    setQuestion(text);
  }

  return (
    <main className="home-page">
      <ChatLayout
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((open) => !open)}
        onCloseSidebar={() => setSidebarOpen(false)}
        sidebarProps={{
          selectedFileName: file?.name,
          onFileSelect: setFile,
          onUpload: handleUpload,
          loadingUpload,
          uploadMessage,
          indexedDocs,
          onNewChat: handleNewChat
        }}
        messages={messages}
        loadingChat={loadingChat}
        question={question}
        onQuestionChange={setQuestion}
        onSubmit={handleAsk}
        onSuggestionClick={handleSuggestionClick}
        error={error}
      />
    </main>
  );
}
