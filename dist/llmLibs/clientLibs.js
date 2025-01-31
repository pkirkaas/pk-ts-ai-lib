import OpenAI from "openai";
//import setTitle from 'console-title';
//import {Message} from '@anthropic-ai/sdk';
//PkLib Imports
import { dtFmt, isString, mkArray, strIncludesAny, } from 'pk-ts-node-lib';
// Local Imports
import { getProviderConfig, getLlmProvider, } from '../init.js';
/*
export interface AnthropicConfig {
  system?: string,
  temperature?: number,
  max_tokens?: number,
}
  */
/**
 * Abstract Client class to provide common interface to different API clients - OpenAI & Anthropic for now, maybe Vertex, LMS, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export class BaseClient {
    //client:object; // The initialized API Client SDK
    client; // The initialized API Client SDK
    sdkClient;
    provider; // The provider name for the default provider config, with URL, default opts, etc
    chatFilePath; // The file patch for the specific chat log. Initialized in 'chat' method.
    constructor(provider) {
        this.provider = getLlmProvider(provider);
        this.createNativeClient();
        //let clientLib = this.providerConfig.clientLib || OpenAI;
    }
    // Constructor actions that can be overridden in subclasses
    createNativeClient(...args) {
        let { clientLib = OpenAI, baseURL, apiKey } = this.providerConfig;
        this.client = new clientLib({ baseURL, apiKey });
    }
    get providerConfig() {
        return getProviderConfig(this.provider);
    }
    async baseChat(msg) {
    }
    /**
     * Returns the models available for the provider
     */
    async getModels(...args) {
        let modelObjs = (await this.client.models.list()).data;
        return modelObjs;
    }
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names
     * @param opts.format?:any - format models? - Currently, just format created date
     * @param opts.sort?:string - sort by ModelObject key
     * @return Array of Model Objects
     */
    async filterModels(opts = {}) {
        let modelObjs = await this.getModels();
        let listOptsDef = { sort: 'created', format: true, filter: '', };
        let { sort, format, filter } = { ...listOptsDef, ...opts };
        if (filter) {
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
        return modelObjs;
    }
}
export class OpenAiClient extends BaseClient {
}
export class ClaudeClient extends BaseClient {
}
export const clientClasses = {
    OpenAiClient,
    ClaudeClient,
};
export function getClientClass(provider) {
    provider = getLlmProvider(provider);
    let config = getProviderConfig(provider);
    let clientClass = config.clientClass || OpenAiClient;
    return clientClass;
}
export function getClient(provider) {
    provider = getLlmProvider(provider);
    let config = getProviderConfig(provider);
    let clientClass = getClientClass(provider);
    let client = new clientClass(provider);
    return client;
}
//# sourceMappingURL=clientLibs.js.map