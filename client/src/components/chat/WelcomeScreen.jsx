const suggestions = [
  "Summarize the uploaded document",
  "What are the main topics?",
  "List key points in bullet form"
];

export default function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-screen__icon">✦</div>
      <h1>How can I help you today?</h1>
      <p>Upload a document from the sidebar, then ask questions about it.</p>

      <div className="welcome-screen__suggestions">
        {suggestions.map((text) => (
          <button
            key={text}
            type="button"
            className="suggestion-chip"
            onClick={() => onSuggestionClick(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
