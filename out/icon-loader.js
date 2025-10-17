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
exports.getIconPath = getIconPath;
const path = __importStar(require("path"));
/*  languageID  ->  file name (without extension)  */
const LANGUAGE_MAP = {
    ada: "ada",
    ahk: "ahk",
    android: "android",
    angular: "angular",
    ansible: "ansible",
    applescript: "applescript",
    appveyor: "appveyor",
    arduino: "arduino",
    asciidoc: "asciidoc",
    asp: "asp",
    assembly: "assembly",
    astro: "astro",
    bat: "bat",
    bazel: "bazel",
    bicep: "bicep",
    brainfuck: "brainfuck",
    c: "c",
    c3: "c3",
    cargo: "cargo",
    circleci: "circleci",
    clojure: "clojure",
    cmake: "cmake",
    cobol: "cobol",
    coffee: "coffee",
    cpp: "cpp",
    crystal: "crystal",
    csharp: "csharp",
    csproj: "csproj",
    css: "css",
    cuda: "cuda",
    cursor: "cursor",
    cython: "cython",
    d: "d",
    dart: "dart",
    delphi: "delphi",
    dockerfile: "docker",
    dockercompose: "docker",
    elixir: "elixir",
    elm: "elm",
    erlang: "erlang",
    fortran: "fortran",
    fsharp: "fsharp",
    go: "go",
    gradle: "gradle",
    graphql: "graphql",
    groovy: "groovy",
    handlebars: "handlebars",
    haskell: "haskell",
    haxe: "haxe",
    html: "html",
    java: "java",
    javascript: "js",
    javascriptreact: "jsx",
    json: "json",
    jsonc: "json",
    julia: "julia",
    kotlin: "kotlin",
    latex: "tex",
    less: "less",
    lisp: "lisp",
    log: "log",
    lua: "lua",
    makefile: "makefile",
    markdown: "markdown",
    matlab: "matlab",
    "objective-c": "objective-c",
    ocaml: "ocaml",
    pascal: "pascal",
    perl: "perl",
    php: "php",
    plaintext: "text",
    postcss: "postcss",
    powershell: "powershell",
    prolog: "prolog",
    protobuf: "protobuf",
    pug: "pug",
    purescript: "purescript",
    python: "python",
    qml: "qml",
    r: "r",
    razor: "razor",
    reason: "reasonml",
    restructuredtext: "restructuredtext",
    ruby: "ruby",
    rust: "rust",
    sass: "scss",
    scss: "scss",
    shaderlab: "hlsl",
    shellscript: "shell",
    smalltalk: "smalltalk",
    solidity: "solidity",
    sql: "sql",
    stylus: "stylus",
    svelte: "svelte",
    swift: "swift",
    systemverilog: "systemverilog",
    toml: "toml",
    tsx: "tsx",
    twig: "twig",
    typescript: "ts",
    typescriptreact: "tsx",
    vala: "vala",
    vb: "vb",
    vhdl: "vhdl",
    viml: "vim",
    vue: "vue",
    wasm: "wasm",
    xml: "xml",
    xsl: "xml",
    yaml: "yaml",
    zig: "zig",
};
const EXTENSION_DIR = path.dirname(__dirname); // out/  ->  root of extension
const ICONS_DIR = path.join(EXTENSION_DIR, "assets", "icons");
function getIconPath(languageId) {
    const file = (LANGUAGE_MAP[languageId.toLowerCase()] ?? "vscode") + ".png";
    return path.join(ICONS_DIR, file);
}
//# sourceMappingURL=icon-loader.js.map