import chalk from 'chalk';
import OpenAI from "openai";
import { generateText, generateObject, } from 'ai';
import _ from 'lodash';
import fs from 'fs';
import mime from 'mime';
import { openai, createOpenAI, } from "@ai-sdk/openai";
import { anthropic, createAnthropic, } from "@ai-sdk/anthropic";
import { togetherai, createTogetherAI } from '@ai-sdk/togetherai';
import { xai, createXai, } from '@ai-sdk/xai'; //X Grok
import { groq, createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
//import {Message} from '@anthropic-ai/sdk';
//PkLib Imports
import { dbgWrt, ask, isFile, stdOut, writeData, dtFmt, JSON5Stringify, isEmpty, isSimpleObject, safeFile, isString, mkArray, strIncludesAny, PkError, typeOf, camelKeys, } from 'pk-ts-node-lib';
// Local Imports
import { getProviderConfig, getLlmProvider, wrapStr, mkDecompParams, buildMsg, wrapCodeFiles, askMsg, } from '../init.js';
export const aiSdkClients = {
    togetherai: { client: togetherai, create: createTogetherAI, },
    openai: { client: openai, create: createOpenAI, },
    groq: { client: groq, create: createGroq, },
    anthropic: { client: anthropic, create: createAnthropic, },
    xai: { client: xai, create: createXai, },
    lms: { create: createOpenAICompatible },
    nebius: { create: createOpenAICompatible },
    openrouter: { create: createOpenRouter },
};
export const defaultSdkChatParams = {
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 8192,
    reasoningEffort: "high",
    //max_tokens: 4096,
};
;
/**
 * Log chats - to file and/or DB
 */
export class ChatLogger {
    provider;
    modelName;
    uMsg;
    msgKeys;
    chatConfig;
    sMsg;
    stamp;
    outPath;
    label;
    chatinfo;
    chatType;
    followupCnt = 0;
    divider = '\n\n# Conversation:\n\n---\n\n';
    logInited = false;
    title;
    constructor({ provider, modelName, chatConfig = {}, uMsg, sMsg, msgKeys = [], chatType = 'uDefChat', outPath = '' }) {
        this.provider = provider;
        this.modelName = modelName;
        this.sMsg = sMsg;
        this.uMsg = uMsg;
        this.chatType = chatType;
        this.chatConfig = chatConfig;
        this.stamp = `${Date.now()}`;
        if (isEmpty(msgKeys)) {
            msgKeys = uMsg;
        }
        this.msgKeys = mkArray(msgKeys);
        this.label = this.msgKeys.join('-').substring(0, 35);
        this.chatinfo = `[${this.label}::${this.provider}:${this.modelName}]-${dtFmt('dt')}`;
        this.title = `${this.provider}-${this.chatType}-${this.label}`;
        let outName = safeFile(`${this.label}-${this.chatType}-${this.provider}-${this.stamp}.md`);
        this.outPath = outPath || `./out/chats/${dtFmt('html')}/${safeFile(this.label)}/${outName}`;
    }
    initFile(args) {
        if (!this.logInited) {
            writeData(`# ${this.title}\n\n<title>${this.title}</title>\n\n` +
                `# Chat Session: ${this.chatinfo}\n\n**chatConfig:**\n\`\`\`\n${JSON5Stringify(this.chatConfig)}\n\`\`\`` +
                `\n\n**Sys Msg:**\n${this.sMsg}\n\n**User Msg**:\n${this.uMsg}\n\n${this.divider}\n\n`, this.outPath);
            this.logInited = true;
            stdOut(chalk.bold(`\nLogging [${this.title}] chat to: [${this.outPath}]\n`));
        }
    }
    /**
     * Write message to log file - type "user" or "assistant"
     */
    wrtUsr(msg) {
        this.initFile();
        this.followupCnt++;
        writeData(`\n\n---\n\n# Followup to ${this.provider} ${this.followupCnt}:\n\n**User:**\n${msg}\n\n`, this.outPath, true);
    }
    wrtAssistant(msg, dets = {}) {
        this.initFile();
        let outStr = `\n\n**${this.provider} Assistant** `;
        //(Usage: [${usage}], Finish: [${finish}]):\n\n${msg}\n\n`, this.outPath, true);
        let { usage, finish } = dets;
        //writeData(`\n\n**${this.provider} Assistant** (Usage: [${usage}], Finish: [${finish}]):\n\n${msg}\n\n`, this.outPath, true);
        if (!isEmpty(dets)) {
            let detsStr = JSON5Stringify(dets);
            //outStr += `Usage:\n\`\`\`\n${detsStr}\n\`\`\`\n`;
            outStr += `Usage:${wrapStr(detsStr)}`;
        }
        //writeData(`\n\n**${this.provider} Assistant** (Usage: [${usage}], Finish: [${finish}]):\n\n${msg}\n\n`, this.outPath, true);
        writeData(`${outStr}\n\n${msg}\n\n`, this.outPath, true);
    }
}
/**
 * Abstract Client class to provide common interface to different API clients -
 * Base/Default to OpenAI
 * Override for Anthropic, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export class BaseClient {
    //client:object; // The initialized API Client SDK
    client; // The initialized API Client SDK
    provider; // The provider name for the default provider config, with URL, default opts, etc
    chatFilePath; // The file patch for the specific chat log. Initialized in 'chat' method.
    temperature;
    modelName;
    constructor(provider) {
        this.provider = getLlmProvider(provider);
        this.createNativeClient();
        //let clientLib = this.providerConfig.clientLib || OpenAI;
    }
    // Constructor actions that can be overridden in subclasses
    createNativeClient(...args) {
        let { clientLib = OpenAI, baseURL, apiKey } = this.providerConfig;
        this.client = new clientLib({ baseURL, apiKey });
        return this.client;
    }
    /**
     * Make parameters for ai-sdk - from sdk default, provider default, & specific
     * ai-sdk params are camelCased - convert
     * Which priority?
     */
    mkSdkChatParams(params = {}) {
        let pConfig = camelKeys(this.providerConfig.defaultOpts);
        params = camelKeys(params);
        let ckDefaultSdkChatParams = camelKeys(defaultSdkChatParams);
        let cParams = { ...ckDefaultSdkChatParams, ...pConfig, ...params };
        return cParams;
    }
    get sdkClient() {
        let sdkClient;
        let aisdk = aiSdkClients[this.provider] || aiSdkClients.openai;
        let name = this.provider;
        let { apiKey, baseURL, } = this.providerConfig;
        if (this.provider === 'openai') { // strict
            let compatibility = 'strict';
            let reasoningEffort = 'high';
            sdkClient = aisdk.create({ apiKey, baseURL, compatibility, reasoningEffort, name, });
        }
        else {
            sdkClient = aisdk.create({ apiKey, baseURL, name });
        }
        return sdkClient;
    }
    get providerConfig() {
        return getProviderConfig(this.provider);
    }
    /**
     * To take uMsg tags & build uMsg & sMsg to call nativeChat
     * Can take 'ASK' param to force interactive ask for usr msg
     * TODO? Should extract filter & get model here, or nativeChat
     */
    async nativeChat(msgs, params) {
        //let {ASK=false, filter, ...opts} = params||{};
        let { ASK = false, ...opts } = params || {};
        let bMsg = await this.prepChat(msgs, ASK);
        return this.nativeChatBuilt({ bMsg, ...opts });
    }
    async nativeChatBuilt(params) {
        console.log("Not implemented in Base!", { params });
        return "Not done in Base";
    }
    //async nativeChatBuilt(bMsg: BuiltMsg, filter?: Strings, chatParams: GenObj = {},): Promise<any> 
    /*
    async nativeChatBuilt({bMsg: BuiltMsg, [key:string]:any}):Promise<any> {
      //filter?: Strings, chatParams: GenObj = {},): Promise<any> {
      return "Under Construction";
    }
      */
    /**
     * Possibly interactive method to set this.modelName & return the model name, based on provider & params
     * @param filter?:Strings - filters for model names, or one of 'current' , 'default', 'all',
     */
    async getModelName(filter) {
        if ((!filter || (filter === 'current')) && this.modelName) {
            return this.modelName;
        }
        let providerConfig = this.providerConfig;
        if (!filter || (filter === 'default')) {
            this.modelName = providerConfig?.model || providerConfig?.defaultModel;
            if (this.modelName) {
                return this.modelName;
            }
        }
        if (!filter && providerConfig.filters) {
            filter = providerConfig.filters;
        }
        let models = await this.filterModels({ filter });
        let names = this.modelObjsToNames(models);
        if (!Array.isArray(names) || !names.length) {
            throw new PkError(`For provider: [${this.provider}] no models found for filter:`, filter);
        }
        if (names.length === 1) {
            this.modelName = names[0];
            return this.modelName;
        }
        // Several matching models - choose
        let modelName = await ask(`Choose a model for provider [${this.provider}]`, { choices: names });
        this.modelName = modelName;
        return this.modelName;
    }
    /**
     * Array of model objects to string array of model names
     */
    modelObjsToNames(models) {
        let names = models.map((model) => model.name || model.id);
        return names;
    }
    /**
     * Returns single chat response as object w. keys:
     * text:string - the text response
     * toolCalls
     * toolResults
     * finishReason
     * usage
     * warnings
     * request
     * response
     * steps
     *
     */
    //async singleSdkChat(messages:SdkMessages, modelName:string, sdkChatParams:SdkChatParams = defaultSdkChatParams):Promise<ChatCompletionMessageParam> {
    async singleSdkChat(messages, modelName, sdkChatParams = {}) {
        sdkChatParams = this.mkSdkChatParams(sdkChatParams);
        let model = this.sdkClient(modelName);
        //@ts-ignore
        let response = await generateText({ messages, model, ...sdkChatParams });
        return response;
    }
    async prepChat(msgs, ASK = false) {
        let bMsg;
        if (ASK || isEmpty(msgs)) {
            bMsg = await askMsg(msgs);
        }
        else {
            bMsg = buildMsg(msgs);
        }
        return bMsg;
    }
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    //async sdkChat({user,system,modelName,temperature}) {
    //async sdkChat(msgs: Strings, ASK = false, filter?: Strings, sdkChatParams: SdkChatParams = {}): Promise<CoreMessage[]> {
    async sdkChat(params) {
        let { msgs, ASK, mnfilters, sdkChatParams } = params;
        let bMsg = await this.prepChat(msgs, ASK);
        sdkChatParams = this.mkSdkChatParams(sdkChatParams);
        return this.sdkChatBuilt({ bMsg, mnfilters, sdkChatParams, });
    }
    mkChatLog({ chatType = "Undefined", uMsg = '', sMsg = '', msgKeys = [], chatConfig = {} }) {
        return new ChatLogger({ provider: this.provider, modelName: this.modelName, chatConfig, uMsg, sMsg, msgKeys, chatType, });
    }
    //async sdkChatBuilt(bMsg: BuiltMsg, filter?: Strings, sdkChatParams: SdkChatParams = {},): Promise<CoreMessage[]> {
    async sdkChatBuilt(params) {
        let { bMsg, mnfilters, sdkChatParams = {} } = params;
        let chatType = 'sdkChat';
        function getDets(resp) {
            let usage = resp?.usage?.totalTokens;
            let finish = resp?.finishReason;
            return { usage, finish };
        }
        sdkChatParams = this.mkSdkChatParams(sdkChatParams);
        //sdkChatParams = {...defaultSdkChatParams, ...sdkChatParams,};
        let { uMsg, sMsg, msgKeys = [] } = bMsg;
        let providerConfig = this.providerConfig;
        //modelName = modelName || this.modelName;
        let modelName = await this.getModelName(mnfilters);
        if (!uMsg) {
            uMsg = await ask(`What to ask [${this.provider}]?`);
        }
        let messages = [
            { role: 'system', content: sMsg },
            { role: 'user', content: uMsg, },
        ];
        //let chatConfig = {temperature};
        let chatConfig = sdkChatParams;
        let chatLog = new ChatLogger({ provider: this.provider, modelName: this.modelName, chatConfig, uMsg, sMsg, msgKeys, chatType, });
        let msgCnt = 0;
        while (uMsg) {
            let response = await this.singleSdkChat(messages, modelName, sdkChatParams);
            let assistant = response.text;
            let dets = getDets(response);
            if (!msgCnt) { // First message - get statistics
                let info = { msgCnt, modelName, sdkChatParams, response, dets };
                dbgWrt(info, `resp-${modelName}`);
            }
            msgCnt++;
            messages.push({ role: 'assistant', content: assistant });
            stdOut(chalk.blue(`\n\n${assistant}\n\n`));
            chatLog.wrtAssistant(assistant, dets);
            uMsg = await ask(`Followup for ${this.provider}?`);
            messages.push({ role: 'user', content: uMsg });
            chatLog.wrtUsr(uMsg);
        }
        return messages;
    }
    /**
     * Generate an object from input messages & schema
     * @param spec:StructureSpec - The schema & definition for the object returned
     * @param msgx:Strings - The messages to ask the user for input
     * TODO: Add 'output' option to return array of objects
     * TODO: Add ProviderOptions param to allow for provider-specific options - temperature, etc
     */
    async sdkObject(spec, msgx, modelName, providerOptions = {}) {
        let msgs = mkArray(msgx);
        //providerOptions = {...defaultSdkChatParams, ...providerOptions,};
        providerOptions = this.mkSdkChatParams(providerOptions);
        let { uMsg, sMsg } = buildMsg(msgs);
        let { schema, definition } = spec;
        let predef = "You are required to provide a valid JSON object, strictly adhering to the JSON schema provided.\n";
        let sdef = `\n${predef}\n${definition}\n`;
        let messages = [
            { role: 'system', content: sMsg },
            { role: 'system', content: sdef },
            { role: 'user', content: uMsg, },
        ];
        modelName = await this.getModelName(modelName);
        let model = this.sdkClient(modelName);
        let res = await generateObject({ model, schema, messages, providerOptions, });
        let obj = res.object;
        return obj;
    }
    /**
     * Test decomp of TS Source Code file
     */
    async sdkTsDecomp(fpath, modelName, providerOptions = {}) {
        let { messages, schema, } = mkDecompParams(fpath);
        //providerOptions = {...defaultSdkChatParams, ...providerOptions,};
        providerOptions = this.mkSdkChatParams(providerOptions);
        /*
        let { uMsg, sMsg } = buildMsg(msgs);
        let { schema, definition } = spec;
        let predef = "You are required to provide a valid object, strictly adhering to the schema provided.\n";
        let sdef = `\n${predef}\n${definition}\n`;
    
        let messages: CoreMessage[] = [
          { role: 'system', content: sMsg },
          { role: 'system', content: sdef },
          { role: 'user', content: uMsg, },
        ];
        */
        modelName = await this.getModelName(modelName);
        let model = this.sdkClient(modelName);
        //console.error(`Trying sdkTsDecomp w.`, {model, schema, messages,fpath,});
        console.error(`Trying sdkTsDecomp w.`, { messages, fpath, });
        dbgWrt({ model, schema, messages, fpath, }, 'gobjParams');
        let res = await generateObject({ model, schema, messages, providerOptions, });
        dbgWrt({ res }, 'gobjRes');
        let obj = res.object;
        return obj;
    }
    /**
     * Returns the models available for the provider
     */
    async getModels(...args) {
        let modelObjs = (await this.client.models.list()).data;
        return modelObjs;
    }
    async getRawModels(...args) {
        let { baseURL, apiKey } = this.providerConfig;
        let options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        let url = `${baseURL}/models`;
        if (this.provider === 'gengemini') {
            url = `${url}?key=${apiKey}&page_size=1000&pageSize=1000`;
        }
        else {
            options.headers.Authorization = `Bearer ${apiKey}`;
        }
        let modelObjs = [];
        //let url = `${baseURL}/models?key=${apiKey}`;
        console.log(`About to fetch models for [${this.provider}] from:
     URL: [${url}], apiKey: [${apiKey}]`);
        let resp = await fetch(url, options);
        let respJson = await resp.json();
        let toRespJson = typeOf(respJson);
        //console.log(`respJson:`, { toRespJson, respJson });
        if (Array.isArray(respJson)) {
            return respJson;
        }
        else if (isSimpleObject(respJson)) {
            if (('object' in respJson) && ('data' in respJson)) {
                modelObjs = respJson.data;
                if (!Array.isArray(modelObjs)) {
                    throw new PkError(`Invalid 'models' list w keys 'object', 'data' - response from ${url} - not array`, { modelObjs });
                }
            }
            else if ('models' in respJson) {
                modelObjs = respJson.models;
            }
            else {
                throw new PkError(`Invalid 'models' list response from ${url} - `, { respJson });
            }
        } // respJson should be array of model def objects - filter, format & sort
        return modelObjs;
    }
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names, or 'all' or empty for all
     * @param opts.format?:any - format models? - Currently, just format created date
     * @param opts.sort?:string - sort by ModelObject key
     * @param opts.type?:string - filter by ModelObject 'type' key - like 'chat'
     * @return Array of Model Objects
     */
    async filterModels(opts = {}) {
        let modelObjs = await this.getModels();
        let listOptsDef = { sort: 'created', format: true, filter: '', };
        let { sort, format, filter, type, } = { ...listOptsDef, ...opts };
        if (filter && filter !== 'all') {
            let filters = mkArray(filter);
            modelObjs = modelObjs.filter((modelObj) => {
                if (modelObj.id) {
                    return strIncludesAny(modelObj.id, filters, true);
                }
                else if (modelObj.name) {
                    return strIncludesAny(modelObj.name, filters, true);
                }
                else { // What to filter on?
                    return true;
                }
            });
        }
        if (sort) {
            let sortBy;
            if (isString(sort)) {
                sortBy = sort;
            }
            else {
                sortBy = 'created';
            }
            let cmpFnc = (a, b) => {
                if (a[sortBy] === b[sortBy]) {
                    return 0;
                }
                if (!(a[sortBy])) {
                    return -1;
                }
                if ((!b[sortBy])) {
                    return 1;
                }
                return b[sortBy] > a[sortBy] ? -1 : 1;
            };
            modelObjs.sort(cmpFnc);
        }
        if (format) {
            modelObjs = modelObjs.map((modelObj) => {
                if (modelObj.created) {
                    modelObj.createdAt = dtFmt('short', modelObj.created * 1000);
                }
                return modelObj;
            });
        }
        if (type) {
            modelObjs = modelObjs.filter((modelObj) => modelObj.type === type);
        }
        return modelObjs;
    }
}
/**
 * The default pk client
 */
export class OpenAiClient extends BaseClient {
    //async nativeChatBuilt(bMsg: BuiltMsg, filter?: Strings, chatParams: GenObj = {}): Promise<any> {
    async nativeChatBuilt(params) {
        let { bMsg, ...opts } = params || {};
        console.log(`in OpenAI nativeChat w msg:`, { bMsg });
        return 'Unimplemented OpenAI Native Chat';
    }
}
export class ClaudeClient extends BaseClient {
    async nativeChatBuilt(params) {
        let { bMsg, filter, ...chatParams } = params;
        //async nativeChatBuilt(bMsg: BuiltMsg, filter?: Strings, chatParams: GenObj = {}): Promise<any> {
        let chatType = "Claude Native";
        let { uMsg, sMsg, msgKeys } = bMsg;
        let system = sMsg;
        let model = await this.getModelName(filter);
        //let {temperature=.1,max_tokens=32000,budget_tokens} = chatParams;
        //let {temperature=.1,max_tokens=4096,budget_tokens} = chatParams;
        //let {temperature=.1,max_tokens=8192,budget_tokens} = chatParams;
        let { temperature = .3, max_tokens = 16192, budget_tokens = 8192 } = chatParams;
        //ONLY if budget_tokens will use 'thinking'
        let claude37Defs = {
            //model: "claude-3-7-sonnet-20250219",
            model,
            temperature,
            max_tokens,
            system,
        };
        if (budget_tokens) {
            if (budget_tokens >= max_tokens) {
                throw new PkError(`budget_tokens >= max_tokens`, { budget_tokens, max_tokens });
            }
            let thinking = {
                temperature: 1,
                thinking: {
                    type: "enabled",
                    budget_tokens,
                },
                betas: ["output-128k-2025-02-19"]
            };
            claude37Defs = { ...claude37Defs, ...thinking };
            console.error(`In claude native chat, with extended thinking`);
        }
        else {
            console.error(`In claude native chat, NO extended thinking!!!`);
        }
        let chatConfig = _.merge({}, claude37Defs, chatParams);
        let chatLog = this.mkChatLog({ chatConfig, uMsg, sMsg, msgKeys, chatType, });
        let msgCnt = 0;
        let messages = [{
                role: "user",
                content: uMsg,
            }];
        let args = { ...chatConfig, messages };
        while (uMsg) {
            let response = await this.client.beta.messages.create(args);
            dbgWrt({ args, response }, 'cldDeepResp');
            console.log(`Returned from test of new Claude 3.7`);
            let assistant = this.extractAssistantResponse(response);
            let usage = this.extractUsageInfo(response);
            chatLog.wrtAssistant(assistant, usage);
            //  return 'done w. test of claude 3.7';
            msgCnt++;
            messages.push({ role: 'assistant', content: assistant });
            stdOut(chalk.blue(`\n\n${assistant}\n\n`));
            uMsg = await ask(`Followup for ${this.provider}?`);
            messages.push({ role: 'user', content: uMsg });
            chatLog.wrtUsr(uMsg);
        }
        return messages;
    }
    /**
   * Extracts usage information from the Anthropic API response
   * @param response - The response from the Anthropic API
   * @returns An object containing token usage information
   */
    extractUsageInfo(response) {
        return {
            inputTokens: response.usage?.input_tokens || 0,
            outputTokens: response.usage?.output_tokens || 0,
            thinkingTokens: response.usage?.thinking_tokens || 0,
            totalTokens: (response.usage?.input_tokens || 0) +
                (response.usage?.output_tokens || 0) +
                (response.usage?.thinking_tokens || 0),
            stopReason: response.stop_reason,
            stopSequence: response.stop_sequence
        };
    }
    /**
   * Extracts the assistant's response content from the Anthropic API response
   * @param response - The response from the Anthropic API
   * @returns The text content of the assistant's response
   */
    //extractAssistantResponse(response: Anthropic.Beta.Messages.Response): string {
    extractAssistantResponse(response) {
        // The content is an array of content blocks
        if (Array.isArray(response.content)) {
            // Filter for text blocks and join them
            return response.content
                .filter(block => block.type === 'text')
                //.map(block => (block as Anthropic.ContentBlock.Text).text)
                .map(block => block.text)
                .join('\n');
        }
        return `\nCLAUDE RESPONSE PARSE FAILED:
  ENCODED RESP:\n${JSON5Stringify(response)}\n`;
    }
}
/**
 * Uses OpenAI API client, but custom methods/implementations
 */
export class TogetherClient extends BaseClient {
    async getModels(...args) {
        console.log(`In Overridden TogetherClient getModels`);
        return await this.getRawModels(...args);
    }
}
export class OpenRouterClient extends BaseClient {
    /** Special - writes openrouter models to
     * "C:/www/NodeTests/NextTests/json-table/src/data/openrouter-models.ts"
     */
    async getModels(...args) {
        // Maps pricing object
        function mapPrice(srcObj) {
            // Validate input: must be a non-null object
            if (typeof srcObj !== 'object' || srcObj === null) {
                return {};
            }
            // Use a symbol to handle NaN keys in the Map
            const NAN_KEY = Symbol('NaN');
            const groupMap = new Map();
            // Process each key-value pair
            for (const key in srcObj) {
                if (Object.prototype.hasOwnProperty.call(srcObj, key)) {
                    const value = srcObj[key];
                    let numValue;
                    // Convert value to number
                    if (typeof value === 'string') {
                        numValue = parseFloat(value);
                    }
                    else if (typeof value === 'number') {
                        numValue = value;
                    }
                    else {
                        numValue = NaN; // Non-string/number values become NaN
                    }
                    // Transform the number
                    let processedValue;
                    if (isNaN(numValue)) {
                        processedValue = NaN;
                    }
                    else {
                        const multiplied = numValue * 1000;
                        processedValue = Math.round(multiplied * 1000) / 1000; // Round to 3 decimal places
                    }
                    // Determine the map key
                    const mapKey = isNaN(processedValue) ? NAN_KEY : processedValue;
                    // Initialize array if key doesn't exist, then add the current key
                    if (!groupMap.has(mapKey)) {
                        groupMap.set(mapKey, []);
                    }
                    groupMap.get(mapKey).push(key);
                }
            }
            // Build the result object
            const result = {};
            for (const [mapKey, keys] of groupMap) {
                // Sort keys alphabetically for consistency
                keys.sort();
                const concatenatedKey = keys.join(' ');
                const value = mapKey === NAN_KEY ? NaN : mapKey;
                result[concatenatedKey] = value;
            }
            return result;
        }
        let models = await super.getModels(...args);
        //@ts-ignore
        let mappedModels = models.map(model => ({
            ...model,
            price: mapPrice(model.pricing),
            moderated: model?.top_provider?.is_moderated,
        }));
        let outPath = "C:/www/NodeTests/NextTests/json-table/src/data/openrouter-models.ts";
        let outStr = `/** OpenRouter Models - as of [${dtFmt('short')}] */
    export const openrouterModels = \n${JSON5Stringify(mappedModels)}\n;\n`;
        fs.writeFileSync(outPath, outStr);
        return models;
    }
}
export const clientClasses = {
    OpenAiClient,
    ClaudeClient,
    TogetherClient,
    OpenRouterClient,
};
export function getPkClientClass(provider) {
    provider = getLlmProvider(provider);
    let config = getProviderConfig(provider);
    let clientClass = config.pkClientClass || OpenAiClient;
    return clientClass;
}
/**
 *
 */
export function getPkClient(provider) {
    provider = getLlmProvider(provider);
    let config = getProviderConfig(provider);
    let clientClass = getPkClientClass(provider);
    let client = new clientClass(provider);
    return client;
}
// Alternate TS mime types: application/x-typescript, text/typescript, text/javascript
/** Returns a message file object to insert in the message array
 * @deprecated - until fixed
*/
export function sdkFileMsgFPart(fpath, role = 'user') {
    if (!isFile(fpath)) {
        throw new PkError(`File [${fpath}] not found`);
    }
    let data = fs.readFileSync(fpath, { encoding: 'utf8' });
    let tsMimeTypes = [
        'application/typescript',
        'application/x-typescript',
        'text/typescript',
        'text/javascript',
    ];
    let k = 2; // Change to try different mime types for TS
    let mimeType = fpath.endsWith('.ts') ? tsMimeTypes[k] : mime.getType(fpath);
    let content = [{ type: "file", mimeType, data }];
    let retMsg = {
        //@ts-ignore
        role,
        content,
    };
    return retMsg;
}
/**
 * Just try wrapCodeFiles - works
 */
export function sdkFileMsg(fpath, role = 'user') {
    if (!isFile(fpath)) {
        throw new PkError(`File [${fpath}] not found`);
    }
    let content = wrapCodeFiles(fpath);
    let retMsg = {
        //@ts-ignore
        role,
        content,
    };
    return retMsg;
}
//# sourceMappingURL=clientLibs.js.map