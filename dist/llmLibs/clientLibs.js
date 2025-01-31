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
        //let clientLib = this.providerConfig.clientLib || OpenAI;
        let { clientLib = OpenAI, baseURL, apiKey } = this.providerConfig;
        this.client = clientLib;
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
        return [{}];
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
    constructor(provider) {
        super(provider);
        let { baseURL, apiKey } = this.providerConfig;
        let clientCreateParams = { apiKey, baseURL, };
        console.log(`getOaiClient:clientCreateParams:`, clientCreateParams);
        this.client = new OpenAI(clientCreateParams);
    }
    async getModels(...args) {
        let modelObjs = (await this.client.models.list()).data;
        return modelObjs;
    }
}
export class ClaudeClient extends BaseClient {
}
//# sourceMappingURL=clientLibs.js.map