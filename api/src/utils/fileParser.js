import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";

export async function extractTextFromFile(filePath, originalName) {
  const ext = path.extname(originalName).toLowerCase();

  if ([".txt", ".md", ".csv", ".json"].includes(ext)) {
    return await fs.readFile(filePath, "utf-8");
  }

  if (ext === ".pdf") {
    const buffer = await fs.readFile(filePath);
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text;
  }

  throw new Error("Only .txt, .md, .csv, .json, and .pdf files are supported");
}