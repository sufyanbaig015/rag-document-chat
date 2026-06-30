import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

export default function MessageList({
  messages,
  loading,
  onSuggestionClick
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const showWelcome = messages.length === 0 && !loading;

  return (
    <div className="message-list">
      {showWelcome ? (
        <WelcomeScreen onSuggestionClick={onSuggestionClick} />
      ) : (
        <div className="message-list-inner">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
