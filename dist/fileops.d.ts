/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
import { Strings } from 'pk-ts-node-lib';
import { MsgObj } from './init.js';
/**
 * Build a message object from MD files in 'rootdirx'
 * Recursively build a message object from MD files in 'rootdirx', keyed by file name
 *
 * @param rootdirx?:Strings - root directory(ies) to find
 * Error if duplicate file names
 * return obj of {key: msg}
 */
export declare function getFileMsgObj(rootdirx?: Strings): MsgObj;
/**
 * Encodes local file w. base64, returns data & mime type
 */
export declare function encodeFile(fpath: string): void;
export declare const exts: {
    '.js': string;
    '.mjs': string;
    '.jsx': string;
    '.tsx': string;
    '.ts': string;
    '.py': string;
    '.java': string;
    '.c': string;
    '.cpp': string;
    '.cs': string;
    '.go': string;
    '.rb': string;
    '.php': string;
    '.swift': string;
    '.kt': string;
    '.rs': string;
    '.scala': string;
    '.pl': string;
    '.lua': string;
    '.sh': string;
    '.bat': string;
    '.ps1': string;
    '.sql': string;
    '.xml': string;
    '.json': string;
    '.json5': string;
    '.yml': string;
    '.yaml': string;
    '.ini': string;
    '.toml': string;
    '.md': string;
    '.txt': string;
    '.log': string;
    '.csv': string;
};
/**
 * Filter out files that match exclude patterns
 * TODO: Improve this to handle more complex patterns
 * @param fpathx - Array of file paths
 * @param excpatx - Array of exclude patterns - currently matches any occurrence of the literal pattern substring
 * To exclude a directory, use a trailing slash
 * @returns Array of file paths that do not match exclude patterns
 */
export declare function filterExcludes(fpathx: Strings, excpatx: Strings): string[];
export type WrapCodeObj = {
    fpaths: Strings;
    debug?: any;
    desc?: string;
    root?: string;
    excPatterns?: Strings;
    types?: Strings;
    dirExc?: Strings;
};
export type WrapCodeParam = string | WrapCodeObj;
export type WrapCodeParams = WrapCodeParam | WrapCodeParam[];
export type WrapCodeObjs = {
    [key: string]: WrapCodeParams;
};
export declare function isWrapCodeObj(src: any): src is WrapCodeObj;
/**
 * Allow string arg to 'wrapCodeNew' to be either a file/dir path,
 * OR key to codeFiles object
 */
export declare function toWrapCodeObj(arg: string | WrapCodeObj): WrapCodeObj;
/**
 * Wraps code in markdown code blocks
 * @param argx:WrapCodeParams - string or object w. fpaths, or array of such
 * @param dbg - debug - just list the file paths
 */
export declare function wrapCodeNew(argx: WrapCodeParams, dbg?: any): string;
/**
 * Wraps code in markdown code blocks
 * The paths are already filtered to exclude directories and files matching exclude patterns
 * The result has a common description section if any, and common root directory, if any
 * @param fpathx:Strings - File Path or array
 * @param {root?:string, desc?:string} - root: Root directory, desc: Description
 * @returns {string} - Markdown code blocks
 *
 */
export declare function wrapCodeFiles(fpathx: Strings, { root, desc }: {
    root?: string;
    desc?: string;
}): string;
/**
 * wrap a preformatted string (JSON prettyprint, etc) in markdown
 * because really error prone to do it manually
 * @param prestr:string - preformatted string
 * @param lang:string default '' - TODO - check lang in md lang keys
 * @return string wrapped for markdown block
 */
export declare function wrapStr(prestr: string, lang?: string): string;
type CodeBlocks = {
    [key: string]: string[];
};
export declare let languages: string[];
/**
 * Returns an array of all files in a directory, recursively
 * With default exclude dirnames & glob patterns
 */
export declare function getAllFiles(dir: string, opts?: any): string[];
/**
 * Use the latest implementation
 * Take a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 * @param resStr - string response from a chatbot
 * @returns an object keyed by lang tag to array of code blocks

 * Best so far, but doesn't handle empty code blocks
 * takes a string response from a chatbot and extracts the code blocks
 */
export declare function extractCode(resStr: string): CodeBlocks;
/**
 * Console.log replacement - excepts outputs string values directly, without
 */
export declare function formatValue(value: any, indentLevel?: number): any;
export declare function logPretty(...args: any[]): void;
export {};
//# sourceMappingURL=fileops.d.ts.map