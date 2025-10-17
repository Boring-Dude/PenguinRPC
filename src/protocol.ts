export type IncomingAction = "ping" | "setActivity" | "clearActivity";

export interface IncomingMessage {
  action: IncomingAction;
  nonce: string; // client-generated
  hmac: string; // HMAC-SHA-256(token, nonce+payloadStr)
  payloadStr?: string; // JSON-stringified payload (absent for ping/clear)
}

export interface SetActivityPayload {
  details?: string;
  state?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  largeImageKey?: string;
  largeImageText?: string;
}

export interface OutgoingMessage {
  ok: boolean;
  error?: string;
  data?: unknown;
}
