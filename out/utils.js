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
exports.DISCORD_IMAGE_TEXT_MAX = exports.DISCORD_IMAGE_KEY_MAX = exports.DISCORD_STATE_MAX = exports.DISCORD_DETAIL_MAX = void 0;
exports.sha256Hex = sha256Hex;
exports.generateToken = generateToken;
exports.hmacSha256Hex = hmacSha256Hex;
exports.safeEqual = safeEqual;
exports.debounce = debounce;
const crypto = __importStar(require("crypto"));
exports.DISCORD_DETAIL_MAX = 128;
exports.DISCORD_STATE_MAX = 128;
exports.DISCORD_IMAGE_KEY_MAX = 32;
exports.DISCORD_IMAGE_TEXT_MAX = 128;
function sha256Hex(input) {
    return crypto.createHash("sha256").update(input).digest("hex");
}
function generateToken(bytes = 24) {
    return crypto.randomBytes(bytes).toString("hex");
}
function hmacSha256Hex(key, payload) {
    return crypto.createHmac("sha256", key).update(payload).digest("hex");
}
function safeEqual(a, b) {
    return crypto.timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
// simple debounce helper
function debounce(fn, ms) {
    let timer;
    return ((...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), ms);
    });
}
//# sourceMappingURL=utils.js.map