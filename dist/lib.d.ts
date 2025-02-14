/**
 * General (non-API dependent) functions
 */
import { z } from 'zod';
import { GenObj, Strings } from 'pk-ts-node-lib';
export declare function consoleDir(arg: any, opts?: {
    depth: any;
    showHidden: boolean;
    colors: boolean;
}): void;
/**
 * Create a structured output schema for openai
 * @param name:string
 * @param description:string
 * @param schema - the base zod schema
 */
export declare function structuredSchema(name: string, description: string, schema: z.ZodTypeAny): z.ZodTypeAny;
/**
 * Build a ZOD schema for structured output & tools for AI endpoints
 */
export declare class StructuredSchema {
    name: string;
    description: string;
    title?: string;
    schema: z.ZodTypeAny;
    examples?: z.ZodTypeAny;
}
/**
 * Make options for model list - sort, format, filter
 */
export declare function mkModelListOpts(opts?: any): any;
/**
 * Process model list - sort, format, filter - expects array of model objects
 * with at least a key of 'id'
 * Returns a processed model list - filtered, sorted, formatted
 *
 */
export type ModelListOpts = {
    sort?: string | boolean;
    filter?: Strings;
    format?: any;
    type?: string;
};
export declare function filterModelObjArr(modelObjs: GenObj[], opts?: ModelListOpts): import("pk-ts-node-lib").GenericObject[];
/**
 * Return the provider key (lms, ollama)
 * @param {string} provider - ollama' - if null, use llmProvider if set, else ask
 * @returns {string}
 */
export declare function getLlmProvider(provider?: any): any;
export declare function getProviderConfig(provider?: any): import("./constants.js").ProviderConfig;
export interface IMsgsParams {
    uMsg?: string | string[] | null;
    sMsg?: string | string[] | null;
}
export type ChatParams = {
    sMsg: string;
    uMsg: string;
};
export declare function validateJson(data: any): import("pk-ts-node-lib").SimpleObject;
export declare function mkRepPath(lbl?: string, ext?: string): string;
export declare function writeLog(str: any, { lbl, ext }?: GenObj): void;
/**
 * Test if a string matches any of the standard unix GLOB patterns.
 * @param {string} str - The string to test.
 * @param {string|string[]} patterns - An array of standard unix GLOB patterns.
 * @returns {boolean} - True if the string matches any of the patterns, false otherwise.
 */
export declare function matchPattern(str: string, patterns: Strings): boolean;
/** Return providers - array of strings or configs
 * @param {boolean} list - if true, return array of strings, else return object
 */
export declare function getProviders(list?: boolean): import("./constants.js").Providers | string[];
/**
 * Takes a msg key or array of msg keys & returns a string of the message keys
 */
export declare function stringifyMsgs(msgs: any): any;
export declare function askLlmProvider(): Promise<any>;
/**
 * Strips opening & closing backticks from text response
 */
export declare function stripBackticks(str: string, lbl?: string): string;
//# sourceMappingURL=lib.d.ts.map