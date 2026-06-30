import axiosClient from "./axiosClient.js";

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await axiosClient.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return data;
}

export async function ingestText(text, source = "manual-text") {
  const { data } = await axiosClient.post("/api/ingest-text", {
    text,
    source
  });

  return data;
}

export async function askQuestion(question) {
  const { data } = await axiosClient.post("/api/chat", { question });
  return data;
}
