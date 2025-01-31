/** Lib for OpenAI API compliant basic local chatbot w. llm-studio  & ollama
 * 
*/

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";

// PK Lib Imports
import {
  ask, writeData, askConfirm, isEmpty, parseArgs, mkArray,
} from 'pk-ts-node-lib';

import {
  GenObj, isObject, isSimpleObject, typeOf,
  PkError, JSON5Stringify,
} from 'pk-ts-common-lib';

// Local Imports
import {
  mkStamp, mkModelListOpts, filterModelObjArr,
  getProviderConfig, 
 // getApiKey, 
  getLlmProvider, 
 // getServerUrl, 
  mkMsgArr, mkLogDets,
  systemMessages, usrMessages, providers, timeout, defaultSysMsg, AllMsgs, initChatLog,
  wordCnt, expandMsgs, Strings, LogItem, logEntities, ChatLog, ChatItem, chatEntities,
} from './init.js';


/**
 * Some providers work better with a direct call to the OpenAI API than
 * using the openai cliient
 * Annoyingly, switch on 'provider' to get right call - currently,
 * gengemini & together
 */
export async function getRawModelObjs(provider = 'together', opts: GenObj = {}) {
  provider = getLlmProvider(provider);
  let {baseURL, apiKey} = getProviderConfig(provider);
  //let apiKey = getApiKey(provider);
 // let baseURL = getServerUrl(provider);
  let options: GenObj = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  };
  let url = `${baseURL}/models`;
  if (provider === 'gengemini') {
    url = `${url}?key=${apiKey}&page_size=1000&pageSize=1000`;
  } else {
    options.headers.Authorization = `Bearer ${apiKey}`;
  }
  let modelObjs: GenObj[] = [];
  //let url = `${baseURL}/models?key=${apiKey}`;
  console.log(`About to fetch models for [${provider}] from:
     URL: [${url}], apiKey: [${apiKey}] & opts:`, opts);
  let resp = await fetch(url, options);
  let respJson = await resp.json();
  //let toRespJson = typeOf(respJson);
  //console.log(`respJson:`, { toRespJson, respJson });
  if (isSimpleObject(respJson)) {
    if (('object' in respJson) && ('data' in respJson)) {
      modelObjs = respJson.data;
      if (!Array.isArray(modelObjs)) {
        throw new PkError(`Invalid 'models' list w keys 'object', 'data' - response from ${url} - not array`, { modelObjs });
      }
    } else if ('models' in respJson) {
      modelObjs = respJson.models;
    } else {
      throw new PkError(`Invalid 'models' list response from ${url} - `, { respJson });
    }
  } // respJson should be array of model def objects - filter, format & sort
  modelObjs = filterModelObjArr(modelObjs, opts);
  return modelObjs;
}

export async function getRawModelList(provider = 'together', opts: GenObj = {}) {
  let modelObjArr = await getRawModelObjs(provider, opts);
  let modelList = modelObjArr.map((modelObj) => modelObj.id);
  return modelList;
}




export function getOaiClient(provider = null) {
  provider = getLlmProvider(provider);
  let {baseURL, apiKey} = getProviderConfig(provider);

  let clientCreateParams = { apiKey, baseURL, timeout, };
  console.log(`getOaiClient:clientCreateParams:`, clientCreateParams);
  let client = new OpenAI(clientCreateParams);
  return client;
}


/**
 * Return array of model def objects in the form:
 * [ { id: 'lmstudio-community/Mistral-Small-Instruct-2409-GGUF/Mistral-Small-Instruct-2409-Q4_K_M.gguf', object: 'model', owned_by: 'lm-studio' } ]
 * @param provider - The provider to use. Defaults to 'openai'.
 * @param sort - Whether to sort the models by the key. Defaults to 'created'.
 * @param format - Whether to format the models create date. Defaults to true.
 * @param filter - Whether to filter the models by filter string. Defaults to '' (no filter).
 * @returns {Promise<ModelInfo[]>} - Array of model objects - ids/names
 */
export async function getModelObjsOai(provider, opts: GenObj = {}) {
  let client = getOaiClient(provider);
  let modelObjs: GenObj[] = (await client.models.list()).data;
  modelObjs = filterModelObjArr(modelObjs, opts);
  return modelObjs;
}
/** Retuns string array of model ids/names  */
export async function getModelList(provider = null, opts: GenObj = {}) {
  let modelObjs = await getModelObjsOai(provider, opts);
  let modelList = modelObjs.map((modelObj) => modelObj.id);
  return modelList;
}

export async function askModel(provider = null, opts: GenObj = {}) {
  provider = getLlmProvider(provider);
  let answer = await ask(`What model to use for provider [${provider}]?`, { choices: await getModelList(provider, opts) });
  return answer;
}
/**
 * Returns the model string for the given provider, by index
 * @param {number} idx - index of model to return - default 0
 * @returns {string} - model string
 */
export async function getModelByIdx(idx = 0, provider = null, opts: GenObj = {}) {
  provider = getLlmProvider(provider);
  let modelList = await getModelList(provider, opts);
  return modelList[idx];
}

/**
 * Takes a model name (id) and array of model def objects 
 * Returns the model def object for the given model name
 */
export function getModelByName(name, modelObjArr) {
  for (let modelObj of modelObjArr) {
    if (modelObj.id === name) {
      return modelObj;
    }
  }
  throw new PkError(`Model ${name} not found in model obj array:`, { modelObjArr });
}

export function parseChatRes(resp) {
  if (!isObject(resp)) {
    throw new PkError(`parseChatRes: resp is not an object:`, { resp });
  }
  let choices = resp?.choices;
  if (!Array.isArray(choices)) {
    throw new PkError(`Choices not array:`, { resp, choices });
  }
  if (choices.length !== 1) {
    throw new PkError(`Choices  array not 1:`, { resp, choices });
  }
  let choice = choices[0];
  if (!isObject(choice)) {
    throw new PkError(`Choice not object:`, { resp, choice });
  }
  let message = choice?.message; // A message object - could have `content` (text), or ?.function_call obj;
  if (message.content) {
    return message.content;
  }
  if (message.function_call) {
    const functionName = message.function_call.name;
    const functionArgs = JSON.parse(message.function_call.arguments);
    return { functionName, functionArgs };
  }
  throw new PkError(`Message not content or function_call:`, { resp, message });
}
/**
 * Chat with OpenAI API
 * @param {string} provider - default: 'lms' 
 * @param {string|string[]|IMsgParams} msgs - If IMsgParams Object, contains sMsg & uMsg
 * if string or string[], contains system messages - prompt for user message.
 * 
 * 
 * 
 * 
 * 
 * system message or array of system messages - if sysMsg is a key in systemMessages, use the value. Concatenates all system messages into one string.
 * @param {string} uMsg - user message or array of user messages - if uMsg is a key in usrMessages, use the value. Concatenates all user messages into one string.
 */
//export async function chat(provider = 'lms', sysMsg: string | string[] = 'ai', uMsg: string | string[] = '') {
//export async function chat(provider = 'lms', msgs?: string | string[] | IMsgsParams) {
//export async function chat(provider = null, ...msgs) {

export async function chat(...args) {
  let hOpts = {
    provider: "The provider to use. Defaults to 'openai'",
    sMsg: "The system message to use. Defaults to 'default'",
    dropSchema: "If true, drop the schema from the ChatLog. Defaults to false",
    followup: "How to ask for followup - 'input' (default), 'editor' (open in editor), 'multi' - multiline,  'none' (no followup)",
  };
  console.log(`in chat - args:`, args);
  let { arr: msgs, opts } = parseArgs(args);
  msgs = mkArray(msgs);
  let { provider = "openai", sMsg, dropSchema, filter, followup } = opts;
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  let chatconfig = config.defaultOpts || {};
  filter = filter || config.defaultFilter;
  //console.log(`in chat:`, {msgs, opts},);

  if (isEmpty(msgs) || opts.ask) {
    let askmsg = await ask(`What do you want to ask?`);
    msgs.push(askmsg);
  }


  let messages: ChatCompletionMessageParam[];
  let client = getOaiClient(provider);
  let models = await getModelList(provider, { filter });
  let model;
  if (models.length === 1) {
    model = models[0];
  } else {
    model = await ask(`For [${provider}]: Which model?`, { choices: models });
  }
  //let model = await ask(`For [${provider}]: Which model?`, { choices: models });
  //let chatinfo = `[${provider}:${model}]-${dtFmt('dt')}`;
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo } = await mkLogDets({ provider, model, msgs, sMsg, chatconfig, });
  //let uMsg = usrmsg;
  messages = await mkMsgArr({ uMsg: usrmsg, sMsg });
  //await askConfirm(chatinfo);
  //await tmpConfirm(chatinfo);
  // 
  let chatLog = await initChatLog({ outpath, chatconfig, dropSchema, label, provider, model, chatinfo, stamp, usrmsg, sysmsg, });

  //writeData(`# Chat Session: ${chatinfo}\n\n**Init Msgs:**\n${JSON5Stringify(messages)}\n\n`, outpath);

  //let usrMsg: string;
  let followupCnt = 0;
  while (true) {
    followupCnt++;
    let response = await client.chat.completions.create({
      messages,
      model,
      ...chatconfig,
    });
    let assistant = parseChatRes(response);
    writeData(`\n\n**${provider} Assistant:**\n${assistant}\n\n`, outpath, true);
    console.log(`\n\n${provider} Response:\n${assistant}\n\n`);
    await chatLog.addChatItem({ response, messages, usrmsg, assistant, chatinfo });
    //usrMsg = await ask(`${provider} chat: Followup?`,{type:followup});
    usrmsg = await ask(`${provider} chat: Followup?`);
    if (!usrmsg) {
      console.log("Aborting");
      break;
    }
    //writeData(`\n\n**Followup:**\n${usrmsg}\n\n`, outpath, true);
    writeData(`\n\n---\n\n# Followup ${followupCnt}:\n\n**User:**\n${usrmsg}\n\n`, outpath, true);
    messages.push({ role: 'assistant', content: assistant });
    messages.push({ role: 'user', content: usrmsg });
  }
  console.log(`\nDone w. Chat\n - Output: ${outpath}`);
}

/**
 * Non interactive chat completion - just return the response string
 * All params required -
 * @param {string} provider - default: 'lms'
 * @param {string} model
 * @param messages - the prepared system & user messages
 */
//export async function chatTask(provider: string, model: string, messages: ChatCompletionMessageParam[]) {
export async function chatTask({ provider, model, msgs, opts }: GenObj = {}) {
  if (!provider) {
    provider = 'lms';
  }
  let config = getProviderConfig(provider);
  if (!model) {
    model = config.model || config.defaultModel;
  }
  if (!model) {
    model = await getModelByIdx();
  }
  //let content = mkMsgStr(msgs);
  let content = await expandMsgs(msgs);
  let messages = [{ role: 'user', content }];

  let client = getOaiClient(provider);
  let response = await client.chat.completions.create({
    //@ts-ignore
    messages,
    model,
  });
  let assistant = parseChatRes(response);
  let logItem = LogItem.create({
    //response, assistant, model, provider, config, content, messages:content,
    content, config, messages, model, opts, provider, response, assistant,
  });
  await logItem.save();
  return assistant;
}


/**
 * A task, non-interactive
 * Takes msgs & an object arg {provider, model, opts} & returns the result
 * Only msgs required
 * @param msgs:Strings - string or array of strings, to build the user message
 */
export async function oaiChatTask(msgs: Strings,
  { provider = 'openai', model = '', opts = {} }:
    { provider?: string, model?: string, opts?: GenObj, } = {}) {

  let config = getProviderConfig(provider);
  if (!model) {
    model = config?.defaultModel;
  }
  //let content = mkMsgStr(msgs);
  let content = await expandMsgs(msgs);
  let messages = [{ role: 'user', content }];
  let client = getOaiClient(provider);
  //return {messages, model, provider};
  let response = await client.chat.completions.create({
    //@ts-ignore
    messages,
    model,
  });
  let assistant = parseChatRes(response);
  let logItem = LogItem.create({
    //response, assistant, model, provider, config, content, messages:content,
    content, config, messages, model, opts, provider, response, assistant,
  });
  await logItem.save();
  return assistant;
}




