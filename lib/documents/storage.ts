import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

export type StoredObject = {
  storageKey: string;
  checksumSha256: string;
  sizeBytes: number;
  mimeType: string;
};

export interface DocumentStorage {
  putObject(input: { tenantId: string; fileName: string; mimeType: string; bytes: Buffer }): Promise<StoredObject>;
}

export class LocalEncryptedDocumentStorage implements DocumentStorage {
  constructor(private readonly root = process.env.DOCUMENT_STORAGE_ROOT ?? "./storage/documents") {}

  async putObject(input: { tenantId: string; fileName: string; mimeType: string; bytes: Buffer }): Promise<StoredObject> {
    const checksumSha256 = createHash("sha256").update(input.bytes).digest("hex");
    const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `${input.tenantId}/${Date.now()}-${checksumSha256.slice(0, 16)}-${safeName}`;
    const destination = path.join(this.root, storageKey);
    await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    await writeFile(destination, input.bytes, { mode: 0o600 });
    return { storageKey, checksumSha256, sizeBytes: input.bytes.byteLength, mimeType: input.mimeType };
  }
}
