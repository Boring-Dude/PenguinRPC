import * as path from "path";
import * as vscode from "vscode";
import { DiscordClient } from "./discordClient";
import { IpcServer } from "./ipcServer";
import {
  IncomingMessage,
  OutgoingMessage,
  SetActivityPayload,
} from "./protocol";
import {
  debounce,
  DISCORD_DETAIL_MAX,
  DISCORD_IMAGE_KEY_MAX,
  DISCORD_IMAGE_TEXT_MAX,
  DISCORD_STATE_MAX,
  generateToken,
} from "./utils";

let ipcServer: IpcServer | null = null;
let discordClient: DiscordClient | null = null;
let statusBarItem: vscode.StatusBarItem | null = null;

const sendEditorSnapshot = debounce(_sendEditorSnapshot, 300);

export async function activate(
  context: vscode.ExtensionContext
): Promise<void> {
  const cfg = vscode.workspace.getConfiguration("discordRpc");

  const token =
    context.globalState.get<string>("discordRpc.token") ?? generateToken();
  await context.globalState.update("discordRpc.token", token);

  const socketDir = path.join(context.globalStorageUri.fsPath, "socket");
  ipcServer = new IpcServer(socketDir, token, (msg) =>
    handleIncoming(msg, token)
  );

  const clientId = cfg.get<string>("clientId") || "1428089034458009770";
  discordClient = new DiscordClient(clientId);

  await Promise.allSettled([ipcServer.start(), discordClient.connect()]);

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  context.subscriptions.push(
    statusBarItem,
    vscode.commands.registerCommand("discordRpcExtension.start", async () => {
      await Promise.allSettled([ipcServer?.start(), discordClient?.connect()]);
      vscode.window.showInformationMessage("Discord RPC started");
      updateStatusBar();
    }),
    vscode.commands.registerCommand("discordRpcExtension.stop", async () => {
      await Promise.allSettled([ipcServer?.stop(), discordClient?.dispose()]);
      vscode.window.showInformationMessage("Discord RPC stopped");
      updateStatusBar();
    }),
    vscode.window.onDidChangeActiveTextEditor(() => sendEditorSnapshot()),
    vscode.window.onDidChangeTextEditorSelection(() => sendEditorSnapshot()),
    vscode.languages.onDidChangeDiagnostics(() => sendEditorSnapshot()),
    vscode.workspace.onDidOpenTextDocument(() => sendEditorSnapshot())
  );

  updateStatusBar();
  sendEditorSnapshot();
}

export async function deactivate(): Promise<void> {
  await Promise.allSettled([
    ipcServer?.stop(),
    discordClient?.dispose(),
    statusBarItem?.dispose(),
  ]);
}

async function handleIncoming(
  msg: IncomingMessage,
  token: string
): Promise<OutgoingMessage> {
  switch (msg.action) {
    case "ping":
      return { ok: true, data: "pong" };
    case "clearActivity":
      try {
        await discordClient?.setActivity(null);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    case "setActivity": {
      let payload: SetActivityPayload = {};
      try {
        payload = JSON.parse(msg.payloadStr ?? "{}");
      } catch {}
      const activity: any = {};
      if (typeof payload.details === "string") {
        activity.details = payload.details.slice(0, DISCORD_DETAIL_MAX);
      }
      if (typeof payload.state === "string") {
        activity.state = payload.state.slice(0, DISCORD_STATE_MAX);
      }
      if (typeof payload.startTimestamp === "number") {
        activity.startTimestamp = payload.startTimestamp;
      }
      if (typeof payload.endTimestamp === "number") {
        activity.endTimestamp = payload.endTimestamp;
      }
      if (typeof payload.largeImageKey === "string") {
        activity.largeImageKey = payload.largeImageKey.slice(
          0,
          DISCORD_IMAGE_KEY_MAX
        );
      }
      if (typeof payload.largeImageText === "string") {
        activity.largeImageText = payload.largeImageText.slice(
          0,
          DISCORD_IMAGE_TEXT_MAX
        );
      }
      try {
        await discordClient?.setActivity(activity);
        return { ok: true, data: "activity_set" };
      } catch (e) {
        return { ok: false, error: String(e) };
      }
    }
    default:
      return { ok: false, error: "unknown action" };
  }
}

async function _sendEditorSnapshot(): Promise<void> {
  if (!discordClient) {
    return;
  }

  const editor = vscode.window.activeTextEditor;
  const languageId = editor?.document.languageId ?? "plaintext";
  const line = editor ? editor.selection.active.line + 1 : undefined;
  const errors = editor ? countErrors(editor.document.uri) : 0;

  const cfg = vscode.workspace.getConfiguration("discordRpc");
  const show = cfg.get<boolean>("showLineAndErrors", true);
  await discordClient.setLanguagePresence(
    languageId,
    show ? line : undefined,
    show ? errors : 0
  );
}

function countErrors(uri: vscode.Uri): number {
  return vscode.languages
    .getDiagnostics(uri)
    .reduce(
      (a, d) => a + (d.severity === vscode.DiagnosticSeverity.Error ? 1 : 0),
      0
    );
}

function updateStatusBar(): void {
  if (!statusBarItem || !ipcServer) {
    return;
  }
  try {
    statusBarItem.text = "Discord RPC: active";
    statusBarItem.tooltip =
      "Local socket for trusted apps. Token stored in extension secret state.";
    statusBarItem.show();
  } catch {
    statusBarItem.hide();
  }
}
