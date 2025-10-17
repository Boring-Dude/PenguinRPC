import * as fs from "fs";
import * as net from "net";
import * as path from "path";
import { IncomingMessage, OutgoingMessage } from "./protocol";
import { hmacSha256Hex, safeEqual } from "./utils";

const MAX_MESSAGE_BYTES = 64_000;
const MAX_CONCURRENT = 4;

export class IpcServer {
  private server: net.Server | null = null;
  private socketPath: string;
  private token: string;
  private onMessage: (msg: IncomingMessage) => Promise<OutgoingMessage>;
  private activeSockets = new Set<net.Socket>();

  constructor(
    socketDir: string,
    token: string,
    onMessage: (msg: IncomingMessage) => Promise<OutgoingMessage>
  ) {
    this.token = token;
    this.onMessage = onMessage;
    this.socketPath = path.join(socketDir, `vscode-discord-rpc.sock`);
  }

  getSocketPath(): string {
    return this.socketPath;
  }

  async start(): Promise<void> {
    if (this.server) {
      return;
    }

    await fs.promises.mkdir(path.dirname(this.socketPath), {
      recursive: true,
      mode: 0o700,
    });
    try {
      await fs.promises.unlink(this.socketPath);
    } catch {}

    this.server = net.createServer({ pauseOnConnect: true }, (socket) =>
      this.handleSocket(socket)
    );

    return new Promise((resolve, reject) => {
      const server = this.server!;
      server!.once("error", reject);
      server!.listen(this.socketPath, () => {
        if (process.platform !== "win32") {
          fs.chmodSync(this.socketPath, 0o600);
        } else if ((server.listen as any).length > 2) {
          // Node ≥ 18 supports permissions on Windows
          (server as any).setPermissions?.(0o600);
        }
        resolve();
      });
    });
  }

  async stop(): Promise<void> {
    if (!this.server) {
      return;
    }
    for (const s of this.activeSockets) {
      s.destroy();
    }
    this.activeSockets.clear();

    return new Promise((resolve) => {
      this.server!.close(() => {
        this.server = null;
        try {
          fs.unlinkSync(this.socketPath);
        } catch {}
        resolve();
      });
    });
  }

  private handleSocket(socket: net.Socket): void {
    if (this.activeSockets.size >= MAX_CONCURRENT) {
      socket.destroy();
      return;
    }
    this.activeSockets.add(socket);
    socket.setEncoding("utf8");
    let buffer = "";

    socket.on("data", (chunk) => {
      buffer += chunk;
      if (Buffer.byteLength(buffer) > MAX_MESSAGE_BYTES) {
        socket.destroy();
        return;
      }
      let idx: number;
      while ((idx = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, idx).trim();
        buffer = buffer.slice(idx + 1);
        if (!line) {
          continue;
        }
        let msg: IncomingMessage;
        try {
          msg = JSON.parse(line);
        } catch {
          socket.write(
            JSON.stringify({ ok: false, error: "invalid json" }) + "\n"
          );
          continue;
        }
        this.authAndHandle(msg, socket).catch(() => socket.destroy());
      }
    });

    socket.once("close", () => this.activeSockets.delete(socket));
    socket.once("error", () => this.activeSockets.delete(socket));
    socket.resume();
  }

  private async authAndHandle(
    msg: IncomingMessage,
    socket: net.Socket
  ): Promise<void> {
    const { nonce, hmac, payloadStr } = msg;
    const expect = hmacSha256Hex(this.token, nonce + (payloadStr ?? ""));
    if (!safeEqual(hmac, expect)) {
      socket.write(JSON.stringify({ ok: false, error: "unauthorized" }) + "\n");
      return;
    }
    const reply = await this.onMessage(msg);
    socket.write(JSON.stringify(reply) + "\n");
  }
}
