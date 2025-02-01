/**
 * Implementation of the AISDK library from Vercel - provider agnostic
 * abstraction layer for AI services.
 */
// npm imports

import {generateText,} from 'ai';
import { google, createGoogleGenerativeAI,
} from '@ai-sdk/google';
import { openai, createOpenAI, } from "@ai-sdk/openai"
import { anthropic, createAnthropic, } from "@ai-sdk/anthropic"
import { togetherai, createTogetherAI } from '@ai-sdk/togetherai';
import { xai, createXai, } from '@ai-sdk/xai'; //X Grok





import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// PK-Lib imports
import {typeOf,dbgWrt,isString,GenObj, isObject, isSimpleObject, stdOut, ask,
} from 'pk-ts-node-lib';





// Local Imports
import { providers, getLlmProvider,
} from './init.js';


// Exports

export const aiSdkClients =  { // Keyed by 'providers' key
  togetherai: {client:togetherai, create:createTogetherAI,},
  openai: {client:openai, create:createOpenAI,},
  anthropic: {client:anthropic, create:createAnthropic,},
  xai: {client:xai, create:createXai,},
  
}

/**
 * Abstracting all 
 */
export class AiSdk {
  client:any; // Initialized AI-SDK client
  provider:string; // The key to the 'providers' config object
  chatPath?:string;
  get providerConfig():GenObj {
    return providers[this.provider];
  }

  createClient(opts:GenObj={}) {
    let params = {...opts, ...this.providerConfig,};
    let {apiKey, baseURL,} = params;
    let create = aiSdkClients[this.provider].create;
    let client = create({apiKey,baseURL});
    return client;
  };

  constructor(provider, opts:GenObj={}) {
    this.provider = getLlmProvider(provider);
    this.client = this.createClient(opts);
  }

  async getModels(...args): Promise<GenObj> {
    console.log("In getModels - client:",this.client);
    return await this.client.listModels();
  }
}























