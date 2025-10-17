import { sha256Hex } from './utils';

export type EditorSnapshot = {
  filenameHash?: string;
  languageId?: string;
  line?: number;
  errors?: number;
};

export function sanitizeFilename(filename?: string): string | undefined {
  if (!filename) {return;}
  const base = filename.split(/[\\/]/).pop()!;
  return sha256Hex(base);
}

export function createSnapshot(data: {
  filename?: string;
  languageId?: string;
  line?: number;
  errors?: number;
}): EditorSnapshot {
  return {
    filenameHash: sanitizeFilename(data.filename),
    languageId: data.languageId,
    line: typeof data.line === 'number' ? data.line : undefined,
    errors: typeof data.errors === 'number' ? data.errors : undefined,
  };
}
