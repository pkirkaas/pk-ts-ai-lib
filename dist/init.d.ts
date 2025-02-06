/**
 * Common export of all libraries used by the project
 */
export * from './oaiLib.js';
export * from './msgs.js';
export * from './llmLibs/clientLibs.js';
export * from './constants.js';
export * from './fileops.js';
export * from './hflib.js';
export * from './vertex.js';
export * from './genailib.js';
export * from './lib.js';
export * from './aisdklib.js';
export * from './claudelib.js';
export * from './sqliteLib/index.js';
export * from './ts-analysis/index.js';
import { WrapCodeParams } from './fileops.js';
import fncSchema from './FncSchemas/fnc2schema.json';
export { fncSchema };
export type Strings = string | string[];
export type MsgObj = {
    [key: string]: WrapCodeParams;
};
/**
 * The Function Task message, for either single function or array of functions.
 * @param fncs - string fnc name, object with property `name`, or array of such
 */
/**
 * From an array of objects, return element with name === name
 */
export declare function getByName(arg: any, name: any): any;
//# sourceMappingURL=init.d.ts.map