import * as crypto from "crypto";

export const DISCORD_DETAIL_MAX = 128;
export const DISCORD_STATE_MAX = 128;
export const DISCORD_IMAGE_KEY_MAX = 32;
export const DISCORD_IMAGE_TEXT_MAX = 128;

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateToken(bytes = 24): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function hmacSha256Hex(key: string, payload: string): string {
  return crypto.createHmac("sha256", key).update(payload).digest("hex");
}

export function safeEqual(a: string, b: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

// simple debounce helper
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): T {
  let timer: NodeJS.Timeout | undefined;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}
