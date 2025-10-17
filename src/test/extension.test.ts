import * as assert from "assert";
import * as vscode from "vscode";

suite("Discord RPC Extension", () => {
  test("should be present", () => {
    assert.ok(vscode.extensions.getExtension("BoringPenguin.discord-rpc"));
  });
  test("should activate", async () => {
    const ext = vscode.extensions.getExtension("BoringPenguin.discord-rpc")!;
    await ext.activate();
    assert.ok(ext.isActive);
  });
});
