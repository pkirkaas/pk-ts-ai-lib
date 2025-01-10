/**
 * Common export of all libraries used by the project
 */
export * from './oaiLib.js';
export * from './msgs.js';
export * from './constants.js';
export * from './fileops.js';
export * from './togetherai.js';
export * from './hflib.js';
export * from './vertex.js';
export * from './genailib.js';
export * from './lib.js';
export * from './claudelib.js';
export * from './sqliteLib/index.js';
export * from './ts-analysis/index.js';
import fncSchema from './FncSchemas/fnc2schema.json';
export { fncSchema };
export type Strings = string | string[];
/**
 * The Function Task message, for either single function or array of functions.
 * @param fncs - string fnc name, object with property `name`, or array of such
 */
export declare function fncTask(fncs: any): Strings;
/**
 * Recursively expands a message string, replacing keys with values.
 */
/**
 * Makes a message string from a string or array of strings.
 * The array of strings can be literal messages, or keys to AllMsgs,
 * which includes system, user, and longer messages found in ./text-message/*.md
 * @param msgs - string or array of strings or arrays of strings, nested as deep as needed
 */
/**
 * From an array of objects, return element with name === name
 */
export declare function getByName(arg: any, name: any): any;
//# sourceMappingURL=init.d.ts.map