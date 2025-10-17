"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordClient = void 0;
const discord_rpc_1 = __importDefault(require("discord-rpc"));
const icon_loader_1 = require("./icon-loader");
const path_1 = __importDefault(require("path"));
class DiscordClient {
    constructor(clientId) {
        this.client = null;
        this.clientId = clientId;
    }
    async connect() {
        if (this.client) {
            return;
        }
        this.client = new discord_rpc_1.default.Client({ transport: 'ipc' });
        return new Promise((resolve, reject) => {
            this.client.once('ready', resolve);
            this.client.login({ clientId: this.clientId }).catch(reject);
        });
    }
    async setLanguagePresence(languageId, line, errors = 0) {
        if (!this.client) {
            return;
        }
        const icon = (0, icon_loader_1.getIconPath)(languageId);
        const large = path_1.default.basename(icon, '.png'); // key must be the asset name registered in Discord app
        const activity = {
            details: `Editing ${languageId}`,
            state: line ? `Line ${line} • Errors ${errors}` : undefined,
            largeImageKey: large,
            largeImageText: 'Visual Studio Code',
            startTimestamp: Date.now(),
        };
        await this.client.setActivity(activity).catch(() => { });
    }
    async setActivity(activity) {
        if (!this.client) {
            return;
        }
        await this.client.setActivity(activity ?? {}).catch(() => { });
    }
    dispose() {
        if (!this.client) {
            return;
        }
        try {
            this.client.destroy();
        }
        catch { }
        this.client = null;
    }
}
exports.DiscordClient = DiscordClient;
//# sourceMappingURL=discordClient.js.map