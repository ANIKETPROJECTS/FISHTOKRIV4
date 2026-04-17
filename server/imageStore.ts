import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.resolve("uploads/products");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const memoryStore = new Map<string, { data: Buffer; mimeType: string }>();

function filePath(productId: string) {
  return path.join(UPLOAD_DIR, productId);
}

function metaPath(productId: string) {
  return path.join(UPLOAD_DIR, `${productId}.meta`);
}

export function setImage(productId: string, data: Buffer, mimeType: string) {
  memoryStore.set(productId, { data, mimeType });
  try {
    fs.writeFileSync(filePath(productId), data);
    fs.writeFileSync(metaPath(productId), mimeType, "utf8");
  } catch (err) {
    console.error("Failed to persist image to disk:", err);
  }
}

export function getImage(productId: string): { data: Buffer; mimeType: string } | undefined {
  if (memoryStore.has(productId)) {
    return memoryStore.get(productId);
  }
  try {
    const imgFile = filePath(productId);
    const metaFile = metaPath(productId);
    if (fs.existsSync(imgFile) && fs.existsSync(metaFile)) {
      const data = fs.readFileSync(imgFile);
      const mimeType = fs.readFileSync(metaFile, "utf8");
      memoryStore.set(productId, { data, mimeType });
      return { data, mimeType };
    }
  } catch (err) {
    console.error("Failed to read image from disk:", err);
  }
  return undefined;
}

export function deleteImage(productId: string) {
  memoryStore.delete(productId);
  try {
    const f = filePath(productId);
    const m = metaPath(productId);
    if (fs.existsSync(f)) fs.unlinkSync(f);
    if (fs.existsSync(m)) fs.unlinkSync(m);
  } catch {}
}

export function hasImage(productId: string): boolean {
  if (memoryStore.has(productId)) return true;
  return fs.existsSync(filePath(productId));
}
