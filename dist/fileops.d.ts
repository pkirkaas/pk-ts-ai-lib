/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
import { GenObj, Strings } from 'pk-ts-node-lib';
export declare function getCommonTs(): string;
export declare function initChatMd({ outpath, model, provider, stamp, }: {
    outpath: any;
    model: any;
    provider: any;
    stamp: any;
}): void;
export declare function getTxtMsg(fname: any): any;
/**
 * Get all text messages in ./text-messages (recursively)
 * Error if duplicate file names
 * return obj of {key: msg}
 */
export declare function getTxtMsgs(): {};
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
    desc?: string;
    root?: string;
    excPatterns?: Strings;
    types?: Strings;
    dirExc?: Strings;
};
export type WrapCodeParam = string | WrapCodeObj;
export type WrapCodeParams = WrapCodeParam | WrapCodeParam[];
export declare function isWrapCodeObj(src: any): src is WrapCodeObj;
/**
 * Wraps code in markdown code blocks
 * @param argx:WrapCodeParams - string or object w. fpaths, or array of such
 */
export declare function wrapCodeNew(argx: WrapCodeParams): string;
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
 * Wraps code in a file in a code block & returns it as a string wrapped in triple backticks
 * with appropriate language tag
 * @param src:Strings|GenObj - path or path array to files/directories, or object w. property fpath, base, desc
 * @param opts?:string|GenObj - optional object with properties:
 * @param opts.root:string? - root directory for project
 * @param opts.desc: string? - description of code block
 *
 */
export declare function wrapCode(srcArg: Strings | GenObj | GenObj[], opts?: any): string;
/**
 * Takes a directory & recurses, wrapping each file in a code block
 * @param dir - directory to recurse
 * @param opts?:string|GenObj - optional object with optional properties:
 *   @param opts.root:string? - root directory for project
 *   @param opts.excPatterns:string[]? - Patterns of filenames to exclude from file list
 *   @param opts.dirExc:string[]? - Patterns of directory names to exclude from file list
 */
export declare function wrapCodeDir(dir: string, opts?: any): string;
/**
 * Returns an array of all files in a directory, recursively
 * With default exclude dirnames & glob patterns
 */
export declare function getAllFiles(dir: string, opts?: any): string[];
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 */
export declare function extractCode1(resStr: string): GenObj;
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export declare function extractCodeOAI(resStr: any): {};
type CodeBlocks = {
    [key: string]: string[];
};
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export declare function extractCodeClaude(resStr: string): CodeBlocks;
export declare let languages: string[];
export declare let langs: string[];
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export declare function extractCodeClaude2(resStr: string): CodeBlocks;
/**
 * Use the latest implementation
 * Take a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 * @param resStr - string response from a chatbot
 * @returns an object keyed by lang tag to array of code blocks
 */
export declare function extractCode(resStr: string): CodeBlocks;
/**
 * Best so far, but doesn't handle empty code blocks
 * takes a string response from a chatbot and extracts the code blocks
 */
export declare function extractCodeC3(resStr: string): CodeBlocks;
export {};
//# sourceMappingURL=fileops.d.ts.map