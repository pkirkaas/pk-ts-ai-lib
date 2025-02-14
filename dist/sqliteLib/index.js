/**
 * Library to capture LLM requests and responses to sqlite databases, using pk-ts-sqlite-lib.
 */
export * from './to-lib.js';
export * from './chat-to-entities.js';
export * from './ts-lib-exports.js';
import { slashPath, } from 'pk-ts-node-lib';
//export * from './chat-to-entities.js';
//export * from './to-lib.js';
//export * from './ts-analysis/index.js';
export const sqlBase = `./dbs`;
export function getDbPath(provider, model, dbName) {
    dbName = dbName + '.sqlite';
    return slashPath(sqlBase, provider, model, dbName);
}
//# sourceMappingURL=index.js.map