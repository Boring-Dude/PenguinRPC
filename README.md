# 🐧 Penguin Discord® RPC

**Rich Discord® presence for VS Code** – show what you’re hacking on without exposing sensitive paths.

---

## Features

- **Language-specific icons** – 100+ mapped out of the box
- **Privacy-first** – only the language ID, line number and error count leave your machine
- **Local socket** – trusted apps on your computer can update presence (token-authenticated + HMAC)
- **Zero config** – works immediately after install; optionally tweak everything

---

## Install

1. Grab the extension from the marketplace ➜ `Penguin Discord® RPC`
2. Reload VS Code
3. Open Discord® – your status should now show _“Editing TypeScript”_

---

## Screenshots

_(coming soon)_

---

## Configuration

| Setting                         | Default               | Description                                           |
| ------------------------------- | --------------------- | ----------------------------------------------------- |
| `Discord®Rpc.clientId`          | `1428089034458009770` | Discord® application ID (own app = upload your icons) |
| `Discord®Rpc.showLineAndErrors` | `true`                | Display current line & error count                    |
| `Discord®Rpc.socketPath`        | _(auto)_              | Override local socket location (advanced)             |

---

## Language Icons

Icons are **asset keys** uploaded to your Discord® application.
We ship a base set; add more by:

1. Go to [Discord® Developers](https://Discord®.com/developers/applications) → _Rich Presence → Art Assets_
2. Drag the wanted PNG from `assets/icons` and set **Key** = file name (without `.png`)
3. Restart VS Code – done!

Missing one? PR the mapping in `src/icon-loader.ts`.

---

## Security Model

- Socket created inside VS Code’s private storage directory (`700` permissions)
- Every message is HMAC-SHA-256 signed with a per-install token stored in secret state
- Max 4 concurrent connections, 64 kB message limit, automatic stale-socket cleanup

---

## Commands

| Command                      | Title              |
| ---------------------------- | ------------------ |
| `Discord®RpcExtension.start` | Start Discord® RPC |
| `Discord®RpcExtension.stop`  | Stop Discord® RPC  |

Bind them to keys or use the Command Palette.

---

## Building from Source

```bash
git clone https://github.com/yourname/penguin-Discord®-rpc.git
cd penguin-Discord®-rpc
npm install
vsce package          # produces .vsix
code --install-extension penguin-Discord®-rpc-*.vsix
```

---

## Troubleshooting

| Symptom                          | Fix                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------ |
| **Status never appears**         | Ensure Discord® is running **before** VS Code; reload window                   |
| **Icons show generic image**     | Upload the missing asset key (see _Language Icons_ section)                    |
| **“Failed to start IPC server”** | Another instance is holding the socket – run `Discord® RPC: Stop` then `Start` |
| **Still stuck?**                 | Enable _Developer Tools_ → Console and file an issue with the log              |

---

## License

MIT – feel free to fork, hack, credit appreciated.

> _"This extension does not mine cryptocurrency, does not download external binaries, and communicates only with the Official Discord® desktop client via the documented Rich Presense API."_
