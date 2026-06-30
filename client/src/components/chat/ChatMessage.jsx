export default function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <article
      className={`chat-message ${isUser ? "chat-message--user" : ""} ${
        isSystem ? "chat-message--system" : ""
      }`}
    >
      <div className="chat-message__avatar" aria-hidden="true">
        {isUser ? "You" : isSystem ? "•" : "AI"}
      </div>

      <div className="chat-message__body">
        <p className="chat-message__content">{message.content}</p>

        {message.sources?.length > 0 && (
          <details className="chat-message__sources">
            <summary>Sources ({message.sources.length})</summary>
            <ul>
              {message.sources.map((source, index) => (
                <li key={`${source.source}-${index}`}>
                  <strong>{source.source}</strong>
                  <span>{source.preview}...</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </article>
  );
}
