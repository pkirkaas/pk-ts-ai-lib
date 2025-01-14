/**
 * Library to capture LLM requests and responses to sqlite databases, using pk-ts-sqlite-lib.
 */

export * from './to-lib.js';
export * from './chat-to-entities.js';
export * from './ts-lib-exports.js';

import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, argv, 
} from 'pk-ts-node-lib';

import {
  GenObj, isObject, isSimpleObject, typeOf, typeOfEach,
  allProps, getProps, objInfo, PkError, dtFmt,
} from 'pk-ts-common-lib';


import {
  commonExports,
} from './ts-lib-exports.js';

//export * from './chat-to-entities.js';
//export * from './to-lib.js';
//export * from './ts-analysis/index.js';

export const sqlBase = `./dbs`;

export function getDbPath(provider, model, dbName) {
  dbName = dbName + '.sqlite';
  return slashPath(sqlBase, provider, model, dbName);
}
