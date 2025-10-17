# 🔄 Changelog

A brief changelog of what's **Added**, _Improved_, **_Fixed_**, and ~~Removed~~.

> **What's coming in the next version...**

---

## [Unreleased]

### **[0.2.0]**

#### What Will Be Added

- **Idle Timer**
  Auto-switch to “Idle” icon after X minutes of inactivity. Configurable via `discordRpc.idleTimeout`.

- **Workspace / Project Name**
  Optional line: _Editing Rust – project: my-app_ (folder name hashed for privacy).

- **Debug Status**
  Show debug configuration when active.

- **Git Branch (optional)**
  Displays branch like `feat/auth`; red icon if uncommitted changes.

- **Test Runner Integration**
  While running: “Running tests…” + percent. On finish: ✅ / ❌ with pass/fail count.

- **Customisable Icons**
  Drop PNGs into `.vscode/discord-icons/` and map in `settings.json`.

- **Multi-workspace Support**
  One presence per VS Code window.

- **Obfuscation Levels**

  - `none`: full info
  - `hash`: language + project
  - `minimal`: "Coding" only

- **Manual Override**
  Command: “Set custom presence…” to type your own status.

- **Soundtrack Detection**
  Append _Artist – Song_ via last.fm or `osascript`.

- **Remote Dev Friendly**
  Run socket on WSL/SSH/Codespaces and tunnel to local Discord.

- **Light / Dark Icon Variants**
  Match VS Code theme with `large_image_key` + `small_image_key`.

- **Rate-limit Health Indicator**
  Tooltip: “Last update: 3 s ago (200 OK)” or “Rate-limited”.

- **Telemetry Toggle**
  Off by default. If on: language stats only (no code/paths).

- **Portable Mode**
  Store socket + token in portable folder (USB support).

---

## ✅ [Released]

### **[0.1.0]** – 2025-10-17

#### Added

- Initial release.
- Language-aware Discord Rich Presence (100+ mapped icons).
- Privacy-first: only language, line & error count transmitted.
- Local UNIX-socket / named-pipe server with HMAC-SHA-256 auth.
- Configurable Discord App ID & visibility options.
- Commands: `Start`, `Stop` Discord RPC.
- Status-bar indicator for socket state.
- Debounced updates (300 ms) to avoid rate limits.
- Auto-cleanup of stale sockets.
- Bundled icons ready for Discord upload.

#### Security

- Sockets created with `0o700` dir & `0o600` file permissions.
- Secure per-install token in extension secret state.
- Max message size: 64 kB; max 4 concurrent connections.

---

> `1.0.0` will be the **first public build** — everything is new!
