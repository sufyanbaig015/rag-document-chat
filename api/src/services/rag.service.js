import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

import { env } from "../config/env.js";

const embeddings = new OpenAIEmbeddings({
  apiKey: env.openaiApiKey,
  model: "text-embedding-3-small"
});

const chatModelOptions = {
  apiKey: env.openaiApiKey,
  model: env.openaiChatModel
};

// gpt-5 only supports default temperature (1), not 0
if (!env.openaiChatModel.startsWith("gpt-5")) {
  chatModelOptions.temperature = 0;
}

const chatModel = new ChatOpenAI(chatModelOptions);

async function hasExistingIndex() {
  if (!existsSync(env.faissIndexPath)) return false;

  const files = await fs.readdir(env.faissIndexPath);
  return files.length > 0;
}

async function loadVectorStore() {
  const exists = await hasExistingIndex();

  if (!exists) {
    throw new Error("No FAISS index found. Please upload a document first.");
  }

  return await FaissStore.load(env.faissIndexPath, embeddings);
}

export async function ingestDocumentText({ text, source }) {
  if (!text || !text.trim()) {
    throw new Error("Document is empty or text could not be extracted.");
  }

  mkdirSync(env.faissIndexPath, { recursive: true });

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 900,
    chunkOverlap: 150
  });

  const docs = await splitter.splitDocuments([
    new Document({
      pageContent: text,
      metadata: { source }
    })
  ]);

  let vectorStore;

  if (await hasExistingIndex()) {
    vectorStore = await FaissStore.load(env.faissIndexPath, embeddings);
    await vectorStore.addDocuments(docs);
  } else {
    vectorStore = await FaissStore.fromDocuments(docs, embeddings);
  }

  await vectorStore.save(env.faissIndexPath);

  return {
    source,
    chunks: docs.length,
    message: "Document indexed successfully"
  };
}

export async function askQuestion(question) {
  if (!question || !question.trim()) {
    throw new Error("Question is required.");
  }

  const vectorStore = await loadVectorStore();

  const results = await vectorStore.similaritySearchWithScore(question, 4);

  const context = results
    .map(([doc, score], index) => {
      return `
SOURCE ${index + 1}
File: ${doc.metadata?.source || "unknown"}
Score: ${score}
Content:
${doc.pageContent}
`;
    })
    .join("\n\n");

  const prompt = `
You are a RAG assistant.

Rules:
1. Answer only from the provided context.
2. If the answer is not present in the context, say: "I could not find this in the uploaded document."
3. Keep the answer clear and practical.
4. Answer in the same language as the user's question.

User question:
${question}

Context:
${context}
`;

  const response = await chatModel.invoke(prompt);

  return {
    answer: response.content,
    sources: results.map(([doc, score]) => ({
      source: doc.metadata?.source || "unknown",
      score,
      preview: doc.pageContent.slice(0, 300)
    }))
  };
}
