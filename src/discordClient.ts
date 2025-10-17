import RPC from 'discord-rpc';
import { getIconPath } from './icon-loader';
import path from 'path';

export class DiscordClient {
  static connect(): any {
    throw new Error("Method not implemented.");
  }
  static setLanguagePresence(languageId: string, arg1: number | undefined, arg2: number) {
    throw new Error("Method not implemented.");
  }
  private client: RPC.Client | null = null;
  private clientId: string;

  constructor(clientId: string) { this.clientId = clientId; }

  async connect(): Promise<void> {
    if (this.client) {return;}
    this.client = new RPC.Client({ transport: 'ipc' } as any);
    return new Promise((resolve, reject) => {
      this.client!.once('ready', resolve);
      this.client!.login({ clientId: this.clientId }).catch(reject);
    });
  }

  async setLanguagePresence(languageId: string, line?: number, errors = 0): Promise<void> {
    if (!this.client) {return;}
    const icon  = getIconPath(languageId);
    const large = path.basename(icon, '.png'); // key must be the asset name registered in Discord app
    const activity: RPC.Presence = {
      details: `Editing ${languageId}`,
      state:   line ? `Line ${line} • Errors ${errors}` : undefined,
      largeImageKey: large,
      largeImageText: 'Visual Studio Code',
      startTimestamp: Date.now(),
    };
    await this.client.setActivity(activity).catch(() => {});
  }

  async setActivity(activity: RPC.Presence | null): Promise<void> {
    if (!this.client) {return;}
    await this.client.setActivity(activity ?? {} as any).catch(() => {});
  }

  dispose(): void {
    if (!this.client) {return;}
    try { this.client.destroy(); } catch {}
    this.client = null;
  }
}
