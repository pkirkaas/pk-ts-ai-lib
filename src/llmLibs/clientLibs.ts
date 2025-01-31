/**
 * LLM Client Lib Implementation Classes
 * 2025-Jan-25 21:53
 * Standardize chats, model fetching, embeddings, etc,
 *  across multiple LLM client libs - openAI, Anthropic, etc
 * Somewhat complicated because some "providers" using the OpenAI SDK client
 * have different params & responses
 * ALSO, some "providers" support several API Clients.
 */
// NPM Imports
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";
import { openai } from "@ai-sdk/openai"
//import { OpenAI } from "@ai-sdk/openai"
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import _ from 'lodash';
//import setTitle from 'console-title';
//import {Message} from '@anthropic-ai/sdk';

//PkLib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, writeData, askConfirm, dtFmt, JSON5Stringify, isEmpty, multiAsk,
  parseArgs, GenObj, isString, mkArray, strIncludesAny,
} from 'pk-ts-node-lib';

// Local Imports


import {
  mkMsgArr, getProviderConfig, expandMsgs, getLlmProvider, ModelListOpts,
  defaultSysMsg, Strings, logEntities, LogItem, initChatLog,
  chatEntities, ChatLog, ChatItem, mkStamp, mkLogDets,
} from '../init.js';

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
export abstract class BaseClient {
  //client:object; // The initialized API Client SDK
  client: GenObj; // The initialized API Client SDK
  sdkClient:GenObj;
  provider: string; // The provider name for the default provider config, with URL, default opts, etc
  chatFilePath: string; // The file patch for the specific chat log. Initialized in 'chat' method.
  constructor(provider: string) {
    this.provider = getLlmProvider(provider);
    this.createNativeClient();
    //let clientLib = this.providerConfig.clientLib || OpenAI;
  }

  // Constructor actions that can be overridden in subclasses
  createNativeClient(...args) {
    let  {clientLib=OpenAI, baseURL, apiKey} = this.providerConfig;
    this.client = new clientLib({baseURL,apiKey});
  }

  get providerConfig(): GenObj {
    return getProviderConfig(this.provider);
  }

  async baseChat(msg) {
  }

  /**
   * Returns the models available for the provider
   */
  async getModels(...args): Promise<GenObj[]> {
    let modelObjs: GenObj[] = (await this.client.models.list()).data;
    return modelObjs;
  }



  /**
   * Returns the models for the provider, optionally filtered/processed:
   * @param opts.filter?:Strings - substring(s) to filter model names
   * @param opts.format?:any - format models? - Currently, just format created date
   * @param opts.sort?:string - sort by ModelObject key 
   * @return Array of Model Objects
   */
  async filterModels(opts: ModelListOpts = {}):Promise<GenObj[]> {
    let modelObjs = await this.getModels();
    let listOptsDef = { sort: 'created', format: true, filter: '', };
    let { sort, format, filter } = { ...listOptsDef, ...opts };

    if (filter) {
      let filters = mkArray(filter);
      modelObjs = modelObjs.filter((modelObj) => {
        if (modelObj.id) {
          return strIncludesAny(modelObj.id, filters, true);
        } else if (modelObj.name) {
          return strIncludesAny(modelObj.name, filters, true);
        } else { // What to filter on?
          return true;
        }
      });
    }
    if (sort) {
      let sortBy: string;
      if (isString(sort)) {
        sortBy = sort;
      } else {
        sortBy = 'created';
      }
      let cmpFnc = (a, b) => { // Sort by key value
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
  /*
  constructor(provider: string) {
    super(provider);
    let { baseURL, apiKey } = this.providerConfig;
    let clientCreateParams = { apiKey, baseURL, };
    console.log(`getOaiClient:clientCreateParams:`, clientCreateParams);
    this.client = new OpenAI(clientCreateParams);
  }
    */
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

export function getClient(provider:string) {
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  let clientClass = getClientClass(provider);
  let client = new clientClass(provider);
  return client;
}





















