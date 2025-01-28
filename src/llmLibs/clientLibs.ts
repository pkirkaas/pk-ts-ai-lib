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
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import _ from 'lodash';
//import setTitle from 'console-title';
//import {Message} from '@anthropic-ai/sdk';

//PkLib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes,  writeData,  askConfirm, dtFmt, JSON5Stringify, isEmpty, multiAsk,
  parseArgs,
} from 'pk-ts-node-lib';

// Local Imports


import {
  mkMsgArr, getProviderConfig, expandMsgs, getLlmProvider,
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
  client:object; // The initialized API Client SDK
  provider:string; // The provider name for the default provider config, with URL, default opts, etc
  chatFilePath:string; // The file patch for the specific chat log. Initialized in 'chat' method.
  constructor(provider:string) {
    this.provider = provider;
  }

  async baseChat(msg) {
  }

  async getModels(...args) {
  }
  
}

export class OpenAiClient extends BaseClient {
  constructor(provider:string) {
    super(provider);
  }
}

export class ClaudeClient extends BaseClient {
}

























