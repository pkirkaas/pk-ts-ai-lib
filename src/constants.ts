/**
 * Predefined constants & options, like system messages, etc
 */

// NPM Imports

// Pk Lib Imports
import {GenObj, Strings,
} from 'pk-ts-node-lib';

// Local Imports

import {
  defaultSysMsg, OpenAiClient, ClaudeClient, TogetherClient, OpenRouterClient,
} from './init.js';

import { VertexAI } from '@google-cloud/vertexai';
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";


export let LMS_PORT = process.env.LMS_PORT;
export let OLLAMA_PORT = process.env.OLLAMA_PORT;

export let oaiCodeParams = {
  temperature: .1,
  top_p: 0.2,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  max_tokens:8192,
};

export let anthropicCodeParams = {
  temperature: .05,
  top_p: 0.2,
  //max_tokens: 8192,
  max_tokens: 60000,
  thinking: {
    type:"enabled",
    budget_tokens: 40000,
  }
};

export const defaultGenerationConfig = { // For Google/VertexAI 
  temperature: .15,
  top_p: 0.2,
  top_k: 40,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
  //maxOutputTokens: 20000,
  maxOutputTokens: 8192,
  candidateCount: 1,
};

/**
 * Configuration for an LLM provider
 * 
 * @property baseURL - Base URL for the provider's API
 * @property apiKey - API key for authentication
 * @property defaultOpts - Default options for API calls
 * @property model - Default model to use
 * @property filters - String or array of strings to filter model names/IDs
 * @property clientLib - Client library to use for API calls
 * @property pkClientClass - Custom client class
 * @property type - Provider type (e.g., "vertex")
 * @property location - Geographic location for the provider
 * @property project - Project ID for the provider
 */
export type ProviderConfig = {
  baseURL?:string,
  apiKey?:string,
  defaultOpts?:GenObj,
  model?: string,
  mnfilters?:string | Strings,
  clientLib?:any,
  pkClientClass?:any,
  type?:string,
  location?:string,
  project?:string,
}

export type Providers = { [key: string]: ProviderConfig };

export const providers:Providers = {
  lms: {
    baseURL: `http://localhost:${LMS_PORT}/v1`,
    apiKey: 'lms',
    defaultOpts: {
      ...oaiCodeParams,
      // max_tokens: 8192,
    },
    //clientLib: OpenAI,
  },
  openrouter : {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL:'https://openrouter.ai/api/v1',
    pkClientClass: OpenRouterClient,
  },
  openai: {
    baseURL: 'https://api.openai.com/v1',
    // clientLib: OpenAI,
    mnfilters: 'latest',
    defaultOpts: {
      ...oaiCodeParams,
      // max_tokens: 8192,
    },
    apiKey: process.env.OPENAI_API_KEY,
    //model: "o1", // $15
    model: "o3-mini", // $1.10, supports structured outputs, functions
    //model:"gpt-4.5-preview", // EXPENSIVE! $75
  },
  groq: {
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  },
  togetherai: {
    baseURL: "https://api.together.xyz/v1",
    mnfilters: ['qwen', 'deepseek', 'meta-llama',],
    apiKey: process.env.TOGETHER_API_KEY,
    pkClientClass: TogetherClient,
  },
  anthropic: {
    clientLib: Anthropic,
    pkClientClass: ClaudeClient,
    model: 'claude-3-7-sonnet-latest',
    apiKey: process.env.ANTHROPIC_API_KEY,
    defaultOpts: {
      ...anthropicCodeParams,
      //max_tokens: 8192,
      //system: defaultSysMsg,
    },
  },
  nebius: {
    clientLib: OpenAI,
    baseURL: "https://api.studio.nebius.ai/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  },
  /*
  ollama: {
    baseURL: `http://localhost:${OLLAMA_PORT}/v1`,
    apiKey: 'ollama',
    defaultOpts: {
      ...oaiCodeParams,
      // max_tokens: 8192,
    },
    // clientLib: OpenAI,
  },
  xai: {
    apiKey: process.env.GROK_API_KEY,
    // clientLib: OpenAI,
    baseURL: "https://api.x.ai/v1",
    model: "grok-beta",
    defaultOpts: {
      ...oaiCodeParams,
      // max_tokens: 8192,
    },
  },
  gengemini: { // Use Gemini API instead of VertexAI
    model: 'gemini-2.0-flash-exp',
    //model: 'gemini-1.5-pro-002',
    filters: [
      'gemini-1.5-pro-exp-0827',
      'gemini-1.5-pro-002',
    ],
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
    project: 'stalwart-veld-438120-v7',
    defaultOpts: {...defaultGenerationConfig},
    apiKey: process.env.GEMINI_API_KEY,
    location: 'us-central1',
  },
  gemini: {
    type: "vertex",
    clientLib: VertexAI,
    model: 'gemini-1.5-pro-002',
    project: 'stalwart-veld-438120-v7',
    defaultOpts: {...defaultGenerationConfig},
    apiKey: process.env.GEMINI_API_KEY,
    location: 'us-central1',
  },
  nvidia: {
    clientLib: OpenAI,
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
  },
  */
};

export const timeout = 96 * 60 * 60 * 1000; //96 hour timeout
