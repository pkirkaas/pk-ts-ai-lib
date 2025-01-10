/** Lib for OpenAI API compliant basic local chatbot w. llm-studio  & ollama
 *
*/
import OpenAI from "openai";
import { GenObj } from 'pk-ts-common-lib';
import { Strings } from './init.js';
/**
 * Some providers work better with a direct call to the OpenAI API than
 * using the openai cliient
 * Annoyingly, switch on 'provider' to get right call - currently,
 * gengemini & together
 */
export declare function getRawModelObjs(provider?: string, opts?: GenObj): Promise<GenObj[]>;
export declare function getRawModelList(provider?: string, opts?: GenObj): Promise<any[]>;
export declare function getOaiClient(provider?: any): OpenAI;
/**
 * Return array of model def objects in the form:
 * [ { id: 'lmstudio-community/Mistral-Small-Instruct-2409-GGUF/Mistral-Small-Instruct-2409-Q4_K_M.gguf', object: 'model', owned_by: 'lm-studio' } ]
 * @param provider - The provider to use. Defaults to 'openai'.
 * @param sort - Whether to sort the models by the key. Defaults to 'created'.
 * @param format - Whether to format the models create date. Defaults to true.
 * @param filter - Whether to filter the models by filter string. Defaults to '' (no filter).
 * @returns {Promise<ModelInfo[]>} - Array of model objects - ids/names
 */
export declare function getModelObjs(provider: any, opts?: GenObj): Promise<GenObj[]>;
/** Retuns string array of model ids/names  */
export declare function getModelList(provider?: any, opts?: GenObj): Promise<any[]>;
export declare function askModel(provider?: any, opts?: GenObj): Promise<any>;
/**
 * Returns the model string for the given provider, by index
 * @param {number} idx - index of model to return - default 0
 * @returns {string} - model string
 */
export declare function getModelByIdx(idx?: number, provider?: any, opts?: GenObj): Promise<any>;
/**
 * Takes a model name (id) and array of model def objects
 * Returns the model def object for the given model name
 */
export declare function getModelByName(name: any, modelObjArr: any): any;
export declare function parseChatRes(resp: any): any;
/**
 * Chat with OpenAI API
 * @param {string} provider - default: 'lms'
 * @param {string|string[]|IMsgParams} msgs - If IMsgParams Object, contains sMsg & uMsg
 * if string or string[], contains system messages - prompt for user message.
 *
 *
 *
 *
 *
 * system message or array of system messages - if sysMsg is a key in systemMessages, use the value. Concatenates all system messages into one string.
 * @param {string} uMsg - user message or array of user messages - if uMsg is a key in usrMessages, use the value. Concatenates all user messages into one string.
 */
export declare function chat(...args: any[]): Promise<void>;
/**
 * Non interactive chat completion - just return the response string
 * All params required -
 * @param {string} provider - default: 'lms'
 * @param {string} model
 * @param messages - the prepared system & user messages
 */
export declare function chatTask({ provider, model, msgs, opts }?: GenObj): Promise<any>;
/**
 * A task, non-interactive
 * Takes msgs & an object arg {provider, model, opts} & returns the result
 * Only msgs required
 * @param msgs:Strings - string or array of strings, to build the user message
 */
export declare function oaiChatTask(msgs: Strings, { provider, model, opts }?: {
    provider?: string;
    model?: string;
    opts?: GenObj;
}): Promise<any>;
//# sourceMappingURL=oaiLib.d.ts.map