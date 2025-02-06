/** Lib for OpenAI API compliant basic local chatbot w. llm-studio  & ollama
 *
*/
import OpenAI from "openai";
import { GenObj } from 'pk-ts-common-lib';
/**
 * Some providers work better with a direct call to the OpenAI API than
 * using the openai cliient
 * Annoyingly, switch on 'provider' to get right call - currently,
 * gengemini & togetherai
 */
export declare function getRawModelObjs(provider?: string, opts?: GenObj): Promise<any[]>;
export declare function getOaiClient(provider?: any): OpenAI;
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
/**
 * Non interactive chat completion - just return the response string
 * All params required -
 * @param {string} provider - default: 'lms'
 * @param {string} model
 * @param messages - the prepared system & user messages
 */
/**
 * A task, non-interactive
 * Takes msgs & an object arg {provider, model, opts} & returns the result
 * Only msgs required
 * @param msgs:Strings - string or array of strings, to build the user message
 */
//# sourceMappingURL=oaiLib.d.ts.map