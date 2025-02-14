"use strict";
/**
 * Library to capture LLM requests and responses to sqlite databases, using pk-ts-sqlite-lib.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.getDbPath = exports.sqlBase = void 0;
__exportStar(require("./to-lib.js"), exports);
__exportStar(require("./chat-to-entities.js"), exports);
__exportStar(require("./ts-lib-exports.js"), exports);
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
//export * from './chat-to-entities.js';
//export * from './to-lib.js';
//export * from './ts-analysis/index.js';
exports.sqlBase = "./dbs";
function getDbPath(provider, model, dbName) {
    dbName = dbName + '.sqlite';
    return pk_ts_node_lib_1.slashPath(exports.sqlBase, provider, model, dbName);
}
exports.getDbPath = getDbPath;
//# sourceMappingURL=index.js.map