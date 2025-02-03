/**
 * General (non-API dependent) functions
 */
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import { GenObj, Strings } from 'pk-ts-node-lib';
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
export declare function getProviderConfig(provider?: any): any;
export interface IMsgsParams {
    uMsg?: string | string[] | null;
    sMsg?: string | string[] | null;
}
export type ChatParams = {
    sMsg: string;
    uMsg: string;
};
export declare function mkChatParams(chatSrc: ChatParams | Strings): ChatParams;
/**
 * Returns the model to use for provider
 * @param provider:string - the provider
 * @param model?:Strings - if empty, the default. If Strings, the model name or filters
 * If more than one model matches filters, asks user
 * @return:string model name
 */
export declare function baseGetModel(provider: string, model?: Strings): Promise<string>;
/**
 * Returns all models for provider, based on model filter
 */
/**
 * BaseChat to chat with any supported provider
 * @param chatSrc:ChatParams|Strings -  either ChatParams or Strings to build chat params
 * @param provider:string - which provider to use
 * @param opts:GenObj - custom opts for this chat. Opt keys:
 *   model:string -
 */
export declare function baseChat(chatSrc: ChatParams | Strings, provider: string, opts?: GenObj): Promise<void>;
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
export declare function allThree(...args: any[]): Promise<void>;
/**
 * Make array of ChatCompletionMessageParam objects from user & system messages
 * @param msgSrc: string | string[] | IMsgsParams - user & system messages
 * If msgSrc is a string or array of strings, it is used as the user message, and
 * the default system message is used.
 */
export declare function mkMsgArr(msgSrc: Strings | null | IMsgsParams): Promise<ChatCompletionMessageParam[]>;
/** Return providers - array of strings or configs
 * @param {boolean} list - if true, return array of strings, else return object
 */
export declare function getProviders(list?: boolean): string[] | {
    lms: {
        baseURL: string;
        apiKey: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
    };
    xai: {
        apiKey: string;
        baseURL: string;
        model: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
    };
    ollama: {
        baseURL: string;
        apiKey: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
    };
    openai: {
        baseURL: string;
        defaultFilter: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
        apiKey: string;
        defaultModel: string;
    };
    togetherai: {
        baseURL: string;
        apiKey: string;
        pkClientClass: typeof import("./init.js").TogetherClient;
    };
    anthropic: {
        clientLib: typeof import("@anthropic-ai/sdk").Anthropic;
        pkClientClass: typeof import("./init.js").ClaudeClient;
        model: string;
        apiKey: string;
        defaultOpts: {
            max_tokens: number;
            system: string;
            temperature: number;
            top_p: number;
        };
    };
    gengemini: {
        type: string;
        model: string;
        models: string[];
        baseURL: string;
        project: string;
        defaultGenerationConfig: {
            temperature: number;
            top_p: number;
            top_k: number;
            frequency_penalty: number;
            presence_penalty: number;
            maxOutputTokens: number;
            candidateCount: number;
        };
        apiKey: string;
        location: string;
    };
    gemini: {
        type: string;
        clientLib: typeof import("@google-cloud/vertexai").VertexAI;
        model: string;
        project: string;
        defaultGenerationConfig: {
            temperature: number;
            top_p: number;
            top_k: number;
            frequency_penalty: number;
            presence_penalty: number;
            maxOutputTokens: number;
            candidateCount: number;
        };
        apiKey: string;
        location: string;
    };
    nebius: {
        clientLib: typeof import("openai").OpenAI;
        baseURL: string;
        apiKey: string;
    };
    nvidia: {
        clientLib: typeof import("openai").OpenAI;
        baseURL: string;
        apiKey: string;
    };
};
interface LogDetails {
    provider: string;
    model: string;
    msgs: Strings;
    sMsg?: Strings;
    chatconfig?: Record<string, any>;
}
export declare function mkLogDets({ provider, model, msgs, sMsg, chatconfig }: LogDetails): Promise<{
    label: any;
    stamp: string;
    usrmsg: string;
    sysmsg: string;
    chatinfo: string;
    outpath: string;
    sysMsgKeys: any;
    usrMsgKeys: any;
}>;
export declare function addRound(outpath: string, round: number, usr?: string, assistant?: string): void;
/**
 * Takes a msg key or array of msg keys & returns a string of the message keys
 */
export declare function stringifyMsgs(msgs: any): any;
export declare function mkStamp(pre?: string): string;
export declare function askLlmProvider(): Promise<any>;
/**
 * Strips opening & closing backticks from text response
 */
export declare function stripBackticks(str: string, lbl?: string): string;
export {};
//# sourceMappingURL=lib.d.ts.map