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
exports.activate = activate;
exports.deactivate = deactivate;
const path = __importStar(require("path"));
const vscode = __importStar(require("vscode"));
const discordClient_1 = require("./discordClient");
const ipcServer_1 = require("./ipcServer");
const utils_1 = require("./utils");
let ipcServer = null;
let discordClient = null;
let statusBarItem = null;
const sendEditorSnapshot = (0, utils_1.debounce)(_sendEditorSnapshot, 300);
async function activate(context) {
    const cfg = vscode.workspace.getConfiguration("discordRpc");
    const token = context.globalState.get("discordRpc.token") ?? (0, utils_1.generateToken)();
    await context.globalState.update("discordRpc.token", token);
    const socketDir = path.join(context.globalStorageUri.fsPath, "socket");
    ipcServer = new ipcServer_1.IpcServer(socketDir, token, (msg) => handleIncoming(msg, token));
    const clientId = cfg.get("clientId") || "1428089034458009770";
    discordClient = new discordClient_1.DiscordClient(clientId);
    await Promise.allSettled([ipcServer.start(), discordClient.connect()]);
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    context.subscriptions.push(statusBarItem, vscode.commands.registerCommand("discordRpcExtension.start", async () => {
        await Promise.allSettled([ipcServer?.start(), discordClient?.connect()]);
        vscode.window.showInformationMessage("Discord RPC started");
        updateStatusBar();
    }), vscode.commands.registerCommand("discordRpcExtension.stop", async () => {
        await Promise.allSettled([ipcServer?.stop(), discordClient?.dispose()]);
        vscode.window.showInformationMessage("Discord RPC stopped");
        updateStatusBar();
    }), vscode.window.onDidChangeActiveTextEditor(() => sendEditorSnapshot()), vscode.window.onDidChangeTextEditorSelection(() => sendEditorSnapshot()), vscode.languages.onDidChangeDiagnostics(() => sendEditorSnapshot()), vscode.workspace.onDidOpenTextDocument(() => sendEditorSnapshot()));
    updateStatusBar();
    sendEditorSnapshot();
}
async function deactivate() {
    await Promise.allSettled([
        ipcServer?.stop(),
        discordClient?.dispose(),
        statusBarItem?.dispose(),
    ]);
}
async function handleIncoming(msg, token) {
    switch (msg.action) {
        case "ping":
            return { ok: true, data: "pong" };
        case "clearActivity":
            try {
                await discordClient?.setActivity(null);
                return { ok: true };
            }
            catch (e) {
                return { ok: false, error: String(e) };
            }
        case "setActivity": {
            let payload = {};
            try {
                payload = JSON.parse(msg.payloadStr ?? "{}");
            }
            catch { }
            const activity = {};
            if (typeof payload.details === "string") {
                activity.details = payload.details.slice(0, utils_1.DISCORD_DETAIL_MAX);
            }
            if (typeof payload.state === "string") {
                activity.state = payload.state.slice(0, utils_1.DISCORD_STATE_MAX);
            }
            if (typeof payload.startTimestamp === "number") {
                activity.startTimestamp = payload.startTimestamp;
            }
            if (typeof payload.endTimestamp === "number") {
                activity.endTimestamp = payload.endTimestamp;
            }
            if (typeof payload.largeImageKey === "string") {
                activity.largeImageKey = payload.largeImageKey.slice(0, utils_1.DISCORD_IMAGE_KEY_MAX);
            }
            if (typeof payload.largeImageText === "string") {
                activity.largeImageText = payload.largeImageText.slice(0, utils_1.DISCORD_IMAGE_TEXT_MAX);
            }
            try {
                await discordClient?.setActivity(activity);
                return { ok: true, data: "activity_set" };
            }
            catch (e) {
                return { ok: false, error: String(e) };
            }
        }
        default:
            return { ok: false, error: "unknown action" };
    }
}
async function _sendEditorSnapshot() {
    if (!discordClient) {
        return;
    }
    const editor = vscode.window.activeTextEditor;
    const languageId = editor?.document.languageId ?? "plaintext";
    const line = editor ? editor.selection.active.line + 1 : undefined;
    const errors = editor ? countErrors(editor.document.uri) : 0;
    const cfg = vscode.workspace.getConfiguration("discordRpc");
    const show = cfg.get("showLineAndErrors", true);
    await discordClient.setLanguagePresence(languageId, show ? line : undefined, show ? errors : 0);
}
function countErrors(uri) {
    return vscode.languages
        .getDiagnostics(uri)
        .reduce((a, d) => a + (d.severity === vscode.DiagnosticSeverity.Error ? 1 : 0), 0);
}
function updateStatusBar() {
    if (!statusBarItem || !ipcServer) {
        return;
    }
    try {
        statusBarItem.text = "Discord RPC: active";
        statusBarItem.tooltip =
            "Local socket for trusted apps. Token stored in extension secret state.";
        statusBarItem.show();
    }
    catch {
        statusBarItem.hide();
    }
}
//# sourceMappingURL=extension.js.map