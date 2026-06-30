import fs from "fs/promises";

import { extractTextFromFile } from "../utils/fileParser.js";
import { ingestDocumentText, askQuestion } from "../services/rag.service.js";

export async function uploadDocument(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }

    const text = await extractTextFromFile(req.file.path, req.file.originalname);

    const result = await ingestDocumentText({
      text,
      source: req.file.originalname
    });

    await fs.unlink(req.file.path).catch(() => {});

    res.json(result);
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({ error: error.message });
  }
}

export async function ingestText(req, res) {
  try {
    const { text, source = "manual-text" } = req.body;

    const result = await ingestDocumentText({ text, source });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function chat(req, res) {
  try {
    const { question } = req.body;

    const result = await askQuestion(question);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
