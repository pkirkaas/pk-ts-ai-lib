import OpenAI from "openai";
import { generateText, } from 'ai';
//import setTitle from 'console-title';
//import {Message} from '@anthropic-ai/sdk';
//PkLib Imports
import { ask, dtFmt, isSimpleObject, isString, mkArray, strIncludesAny, PkError, typeOf, } from 'pk-ts-node-lib';
// Local Imports
import { getProviderConfig, getLlmProvider, aiSdkClients, } from '../init.js';
;
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
        let { apiKey, baseURL, } = this.providerConfig;
        if (this.provider === 'openai') { // strict
            let compatibility = 'strict';
            let reasoningEffort = 'high';
            sdkClient = aisdk.create({ apiKey, baseURL, compatibility, reasoningEffort });
        }
        else {
            sdkClient = aisdk.create({ apiKey, baseURL });
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
    async singleSdkChat(messages, temperature, modelName) {
        let model = this.sdkClient(modelName);
        //@ts-ignore
        let response = await generateText({ messages, temperature, model });
        return response;
    }
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    async sdkChat({ user, system, modelName, temperature }) {
        let providerConfig = this.providerConfig;
        modelName = modelName || this.modelName;
        temperature = temperature || this.temperature || providerConfig?.defaultOpts?.temperature || 0;
        let sdkClient = this.sdkClient;
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