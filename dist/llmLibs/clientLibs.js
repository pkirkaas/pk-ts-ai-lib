import OpenAI from "openai";
import { generateText, generateObject, } from 'ai';
import { openai, createOpenAI, } from "@ai-sdk/openai";
import { anthropic, createAnthropic, } from "@ai-sdk/anthropic";
import { togetherai, createTogetherAI } from '@ai-sdk/togetherai';
import { xai, createXai, } from '@ai-sdk/xai'; //X Grok
//import {Message} from '@anthropic-ai/sdk';
//PkLib Imports
import { ask, stdOut, writeData, dtFmt, JSON5Stringify, isEmpty, isSimpleObject, isString, mkArray, strIncludesAny, PkError, typeOf, } from 'pk-ts-node-lib';
// Local Imports
import { getProviderConfig, getLlmProvider, buildMsg, } from '../init.js';
export const aiSdkClients = {
    togetherai: { client: togetherai, create: createTogetherAI, },
    openai: { client: openai, create: createOpenAI, },
    anthropic: { client: anthropic, create: createAnthropic, },
    xai: { client: xai, create: createXai, },
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
    followupCnt = 0;
    divider = '\n\n# Conversation:\n\n---\n\n';
    logInited = false;
    title;
    constructor({ provider, modelName, chatConfig = {}, uMsg, sMsg, msgKeys = [], outPath = '' }) {
        this.provider = provider;
        this.modelName = modelName;
        this.sMsg = sMsg;
        this.uMsg = uMsg;
        this.chatConfig = chatConfig;
        this.stamp = `${Date.now()}`;
        if (isEmpty(msgKeys)) {
            msgKeys = uMsg;
        }
        this.msgKeys = mkArray(msgKeys);
        this.label = this.msgKeys.join('-').substring(0, 25);
        this.chatinfo = `[${this.label}::${this.provider}:${this.modelName}]-${dtFmt('dt')}`;
        this.title = `${this.provider} - ${this.label}`;
        this.outPath = outPath || `./out/chats/${dtFmt('html')}/${this.label}/${this.label}--${this.provider}-${this.stamp}.md`;
    }
    initFile(args) {
        if (!this.logInited) {
            writeData(`# ${this.title}\n\n<title>${this.title}</title>\n\n` +
                `# Chat Session: ${this.chatinfo}\n\n**chatConfig:**\n\`\`\`\n${JSON5Stringify(this.chatConfig)}\n\`\`\`` +
                `\n\n**Sys Msg:**\n${this.sMsg}\n\n**User Msg**:\n${this.uMsg}\n\n${this.divider}\n\n`, this.outPath);
            this.logInited = true;
            stdOut(`\nLogging [${this.title}] chat to: [${this.outPath}]\n`);
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
    wrtAssistant(msg) {
        this.initFile();
        writeData(`\n\n**${this.provider} Assistant:**\n\n${msg}\n`, this.outPath, true);
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
    async nativeChat(msg) {
    }
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
    async singleSdkChat(messages, temperature, modelName) {
        let model = this.sdkClient(modelName);
        //@ts-ignore
        let response = await generateText({ messages, temperature, model });
        return response;
    }
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    //async sdkChat({user,system,modelName,temperature}) {
    async sdkChat(msgs, modelName, temperature) {
        let msgKeys = mkArray(msgs);
        let { uMsg, sMsg } = buildMsg(msgKeys);
        let providerConfig = this.providerConfig;
        //modelName = modelName || this.modelName;
        modelName = await this.getModelName(modelName);
        temperature = temperature || this.temperature || providerConfig?.defaultOpts?.temperature || 0;
        if (!uMsg) {
            uMsg = await ask(`What to ask [${this.provider}]?`);
        }
        let messages = [
            { role: 'system', content: sMsg },
            { role: 'user', content: uMsg, },
        ];
        let chatConfig = { temperature };
        let chatLog = new ChatLogger({ provider: this.provider, modelName: this.modelName, chatConfig, uMsg, sMsg, msgKeys });
        while (uMsg) {
            let response = await this.singleSdkChat(messages, temperature, modelName);
            let assistant = response.text;
            messages.push({ role: 'assistant', content: assistant });
            stdOut(`\n\n${assistant}\n\n`);
            chatLog.wrtAssistant(assistant);
            uMsg = await ask(`Followup for ${this.provider}?`);
            messages.push({ role: 'user', content: uMsg });
            chatLog.wrtUsr(uMsg);
        }
        return messages;
    }
    /**
     * Generate an object from
     */
    //async sdkObject(msgs:Strings, schema:z.ZodType, modelName?:string):Promise<any> {
    async sdkObject(msgs, schema, modelName) {
        let msgKeys = mkArray(msgs);
        let { uMsg, sMsg } = buildMsg(msgKeys);
        let messages = [
            { role: 'system', content: sMsg },
            { role: 'user', content: uMsg, },
        ];
        modelName = await this.getModelName(modelName);
        let model = this.sdkClient(modelName);
        let res = await generateObject({ model, schema, messages, });
        return res;
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
}
export class ClaudeClient extends BaseClient {
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
export const clientClasses = {
    OpenAiClient,
    ClaudeClient,
    TogetherClient,
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
//# sourceMappingURL=clientLibs.js.map