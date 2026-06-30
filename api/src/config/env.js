export const env = {
  port: process.env.PORT || 5051,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiChatModel: process.env.OPENAI_CHAT_MODEL || "gpt-5",
  faissIndexPath: process.env.FAISS_INDEX_PATH || "./storage/faiss_index"
};