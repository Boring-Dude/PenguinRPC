"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFilename = sanitizeFilename;
exports.createSnapshot = createSnapshot;
const utils_1 = require("./utils");
function sanitizeFilename(filename) {
    if (!filename) {
        return;
    }
    const base = filename.split(/[\\/]/).pop();
    return (0, utils_1.sha256Hex)(base);
}
function createSnapshot(data) {
    return {
        filenameHash: sanitizeFilename(data.filename),
        languageId: data.languageId,
        line: typeof data.line === 'number' ? data.line : undefined,
        errors: typeof data.errors === 'number' ? data.errors : undefined,
    };
}
//# sourceMappingURL=privacyFilter.js.map