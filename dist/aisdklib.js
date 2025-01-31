/**
 * Implementation of the AISDK library from Vercel - provider agnostic
 * abstraction layer for AI services.
 */
// npm imports
import { openai, createOpenAI, } from "@ai-sdk/openai";
import { anthropic, createAnthropic, } from "@ai-sdk/anthropic";
import { togetherai, createTogetherAI } from '@ai-sdk/togetherai';
import { xai, createXai, } from '@ai-sdk/xai'; //X Grok
// Local Imports
import { providers, getLlmProvider, } from './init.js';
// Exports
export const aiSdkClients = {
    togetherai: { client: togetherai, create: createTogetherAI, },
    openai: { client: openai, create: createOpenAI, },
    anthropic: { client: anthropic, create: createAnthropic, },
    xai: { client: xai, create: createXai, },
};
/**
 * Abstracting all
 */
export class AiSdk {
    client; // Initialized AI-SDK client
    provider; // The key to the 'providers' config object
    chatPath;
    get providerConfig() {
        return providers[this.provider];
    }
    createClient(opts = {}) {
        let params = { ...opts, ...this.providerConfig, };
        let { apiKey, baseURL, } = params;
        let create = aiSdkClients[this.provider].create;
        let client = create({ apiKey, baseURL });
        return client;
    }
    ;
    constructor(provider, opts = {}) {
        this.provider = getLlmProvider(provider);
        this.client = this.createClient(opts);
    }
    async getModels(...args) {
        console.log("In getModels - client:", this.client);
        return await this.client.listModels();
    }
}
//# sourceMappingURL=aisdklib.js.map