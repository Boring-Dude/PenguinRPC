"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpcServer = void 0;
const fs = __importStar(require("fs"));
const net = __importStar(require("net"));
const path = __importStar(require("path"));
const utils_1 = require("./utils");
const MAX_MESSAGE_BYTES = 64000;
const MAX_CONCURRENT = 4;
class IpcServer {
    constructor(socketDir, token, onMessage) {
        this.server = null;
        this.activeSockets = new Set();
        this.token = token;
        this.onMessage = onMessage;
        this.socketPath = path.join(socketDir, `vscode-discord-rpc.sock`);
    }
    getSocketPath() {
        return this.socketPath;
    }
    async start() {
        if (this.server) {
            return;
        }
        await fs.promises.mkdir(path.dirname(this.socketPath), {
            recursive: true,
            mode: 0o700,
        });
        try {
            await fs.promises.unlink(this.socketPath);
        }
        catch { }
        this.server = net.createServer({ pauseOnConnect: true }, (socket) => this.handleSocket(socket));
        return new Promise((resolve, reject) => {
            const server = this.server;
            server.once("error", reject);
            server.listen(this.socketPath, () => {
                if (process.platform !== "win32") {
                    fs.chmodSync(this.socketPath, 0o600);
                }
                else if (server.listen.length > 2) {
                    // Node ≥ 18 supports permissions on Windows
                    server.setPermissions?.(0o600);
                }
                resolve();
            });
        });
    }
    async stop() {
        if (!this.server) {
            return;
        }
        for (const s of this.activeSockets) {
            s.destroy();
        }
        this.activeSockets.clear();
        return new Promise((resolve) => {
            this.server.close(() => {
                this.server = null;
                try {
                    fs.unlinkSync(this.socketPath);
                }
                catch { }
                resolve();
            });
        });
    }
    handleSocket(socket) {
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
            let idx;
            while ((idx = buffer.indexOf("\n")) >= 0) {
                const line = buffer.slice(0, idx).trim();
                buffer = buffer.slice(idx + 1);
                if (!line) {
                    continue;
                }
                let msg;
                try {
                    msg = JSON.parse(line);
                }
                catch {
                    socket.write(JSON.stringify({ ok: false, error: "invalid json" }) + "\n");
                    continue;
                }
                this.authAndHandle(msg, socket).catch(() => socket.destroy());
            }
        });
        socket.once("close", () => this.activeSockets.delete(socket));
        socket.once("error", () => this.activeSockets.delete(socket));
        socket.resume();
    }
    async authAndHandle(msg, socket) {
        const { nonce, hmac, payloadStr } = msg;
        const expect = (0, utils_1.hmacSha256Hex)(this.token, nonce + (payloadStr ?? ""));
        if (!(0, utils_1.safeEqual)(hmac, expect)) {
            socket.write(JSON.stringify({ ok: false, error: "unauthorized" }) + "\n");
            return;
        }
        const reply = await this.onMessage(msg);
        socket.write(JSON.stringify(reply) + "\n");
    }
}
exports.IpcServer = IpcServer;
//# sourceMappingURL=ipcServer.js.map