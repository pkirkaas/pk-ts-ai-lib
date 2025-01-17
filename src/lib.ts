/**
 * General (non-API dependent) functions
 */

// NPM Imports
import * as ts from 'typescript';
import setTitle from 'console-title';
import path from 'path';
import fs from 'fs-extra';
//import * as slugify from 'slugify';
import  slugify  from 'slugify';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
import _ from "lodash";

// PkLib Imports

import {
  GenObj, typeOf,  writeData, ajvSchema, isSimpleObject, PkError, isEmpty,mkArray, Strings,
  ask, multiAsk, dtFmt, parseArgs, JSON5Stringify, JSONStringify, inArr1NinArr2,
} from 'pk-ts-node-lib';

// Local Imports

import {
  oaiChatTask, geminiChatTask, claudeChatTask,  expandMsgs,
  //mkMsgStr,
  fncSchema,
  systemMessages, usrMessages, providers, timeout, defaultSysMsg, AllMsgs, initChatLog,
  wordCnt, LogItem, logEntities, ChatLog, ChatItem, chatEntities, 
} from './init.js';

export let llmProvider: string; //Session provider 


export function getApiKey(provider = null) {
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  let apiKey = config.apiKey;
  return apiKey;
}

/**
 * Make options for model list - sort, format, filter
 */
export function mkModelListOpts(opts: any = {}) {
  let listOptsDef = { sort: 'created', format: true, filter: '', };
  opts = { ...listOptsDef, ...opts };
  return opts;
}

/**
 * Process model list - sort, format, filter - expects array of model objects
 * with at least a key of 'id'
 * Returns a processed model list - filtered, sorted, formatted
 * 
 */
export function processModelList(modelObjs: GenObj[], opts: GenObj = {}) {
  if (isEmpty(opts)) {
    opts = {};
  }
  let listOptsDef = { sort: 'created', format: true, filter: '', };
  let { sort, format, filter } = { ...listOptsDef, ...opts };

  if (filter) {
    modelObjs = modelObjs.filter((modelObj) => {
      if (modelObj.id) {
        return modelObj.id.toLowerCase().includes(filter.toLowerCase());
      } else if (modelObj.name) {
        return modelObj.name.toLowerCase().includes(filter.toLowerCase());
      } else { // What to filter on?
        return true;
      }
    });
  }
  if (sort) {
    let cmpFnc = (a, b) => { // Sort by key value
      if (a[sort] === b[sort]) {
        return 0;
      }
      if (!(a[sort])) {
        return -1;
      }
      if ((!b[sort])) {
        return 1;
      }
      return b[sort] > a[sort] ? -1 : 1;
    };
    modelObjs.sort(cmpFnc);
  }
  if (format) {
    modelObjs = modelObjs.map((modelObj) => {
      //let { id, created, } = modelObj;
      if (modelObj.created) {
        modelObj.createdAt = dtFmt('short', modelObj.created * 1000);
      }
      return modelObj;
    });
  }
  return modelObjs;

}

/**
 * Return the provider key (lms, ollama)
 * @param {string} provider - ollama' - if null, use llmProvider if set, else ask
 * @returns {string}
 */
export function getLlmProvider(provider = null) {
  if (!provider) {
    provider = llmProvider;
  }
  if (!provider) {
    provider = askLlmProvider();
  }
  if (provider && Object.keys(providers).includes(provider)) {
    setTitle(provider);
    llmProvider = provider;
    return provider;
  } else {
    throw new PkError(`No provider found for ${provider}`);
  }
}

export function getProviderConfig(provider = null) {
  provider = getLlmProvider(provider);
  return providers[provider];
}

export function getServerUrl(provider = null) {
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  return config.baseURL;
}



export interface IMsgsParams {
  uMsg?: string | string[] | null;
  sMsg?: string | string[] | null;
};

export function validateJson(data) {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  if (!isSimpleObject(data)) {
    let tod = typeOf(data);
    throw new PkError(`validateJson - Invalid type [${tod}] for 'data':`, { data });
  }
  let validate = ajvSchema(fncSchema, { strictSchema: false });
  let valid = validate(data);
  if (!valid) {
    throw new PkError(`Invalid FncSchema data:`, { data, errors: validate.errors });
  }
  return data;

}
export function mkRepPath(lbl = 'log-out', ext = 'md') {
  return `./out/${lbl}-${Date.now()}.${ext}`;
}

export function writeLog(str, { lbl, ext }: GenObj = {}) {
  let lpath = mkRepPath(lbl, ext);
  writeData(str, lpath);
}


//export function matchPattern(str: string, patterns: string[]): boolean {
/**
 * Test if a string matches any of the standard unix GLOB patterns.
 * @param {string} str - The string to test.
 * @param {string|string[]} patterns - An array of standard unix GLOB patterns.
 * @returns {boolean} - True if the string matches any of the patterns, false otherwise.
 */
export function matchPattern(str: string, patterns: Strings): boolean {
  let patternArr = mkArray(patterns);
  const globToRegex = (glob: string): RegExp => {
    const escaped = glob.replace(/[.+^$(){}|[\]\\]/g, '\\$&'); // Escape special regex chars
    const regexStr = `^${escaped.replace(/\*/g, '.*')}$`; // Replace `*` with `.*`
    return new RegExp(regexStr);
  };

  return patternArr.some(pattern => globToRegex(pattern).test(str));
}


export async function allThree(...args) {
  throw new PkError(`allThree is not implemented`);
}
/*
export async function allThree(...args) {
let {arr:msgs, opts} = parseArgs(args);
//let message = mkMsgStr(msgs);
let message = expandMsgs(...msgs,opts);
let bots = {
  gemini: geminiChatTask,
  claude: claudeChatTask,
  oai: oaiChatTask,
};
let out = `# Result from allThree (refactored):\n\n## **User Message:**\n\n${message}\n\n**Answers:**\n\n`;

//##**Gemini**\n\n${gemResp}\n\n## **Claude:**\n\n${claudeResp}\n\n## **OAIResp:**\n\n${oaiResp}\n\nDONE\n\n`;
// let claudeResp, gemResp, oaiResp = '';
console.log(`About to call all 3 w. UserMsg: [${message}] - `);
for (let bot in bots) {
  let task = bots[bot];
  try {
    console.log(`Getting ${bot} - ...`);
    let resp = await task(message);
    out += `\n\n## ${bot}\n\n${resp}\n\n`;
    console.log(`Got ${bot} - ...`);
  } catch (e) {
    console.error(`${bot} Exception:`, e);
    out += `\n\n## ${bot}\n\n **Exception:** ${e.name}, Cause: ${e.cause}: [${e.message}]`;
  }
}
out += `\n\n## DONE\n\n`;
let outPath = mkRepPath('All-Three-2');
//let out = `# Result from allThree:\n\n## **User Message:**\n\n${message}\n\n**Answers:**\n\n##**Gemini**\n\n${gemResp}\n\n## **Claude:**\n\n${claudeResp}\n\n## **OAIResp:**\n\n${oaiResp}\n\nDONE\n\n`;
writeData(out, outPath);
return `Done w. allThree, output: [${outPath}]`;
}
export async function allThreeOrig(...msgs) {
//let message = mkMsgStr(msgs);
let message = expandMsgs(msgs);
let bots = {
  gemini: geminiChatTask,
  claude: claudeChatTask,
  oai: oaiChatTask,
};
// let out = `# Result from allThree:\n\n## **User Message:**\n\n${message}\n\n**Answers:**\n\n`;

//##**Gemini**\n\n${gemResp}\n\n## **Claude:**\n\n${claudeResp}\n\n## **OAIResp:**\n\n${oaiResp}\n\nDONE\n\n`;
let claudeResp, gemResp, oaiResp = '';
console.log(`About to call all 3 w. UserMsg: [${message}] - Claude First...`);
try {
  claudeResp = await claudeChatTask(message);
  console.log(`Got Claude - call Gemini...`);
} catch (e) {
  console.error(`Claude Exception:`, e);
  claudeResp = `Exception: ${e.name}, Cause: ${e.cause}: [${e.message}]`;
}
try {
  gemResp = await geminiChatTask(message);
  console.log(`Got Gemini - call oai...`);
} catch (e) {
  console.error(`Gemini Exception:`, e);
  gemResp = `Exception: ${e.name}, Cause: ${e.cause}: [${e.message}]`;
}
try {
  oaiResp = await oaiChatTask(message);
} catch (e) {
  console.error(`OAI Exception:`, e);
  oaiResp = `Exception: ${e.name}, Cause: ${e.cause}: [${e.message}]`;
}
let outPath = mkRepPath('All-Three');
let out = `# Result from allThree:\n\n## **User Message:**\n\n${message}\n\n**Answers:**\n\n##**Gemini**\n\n${gemResp}\n\n## **Claude:**\n\n${claudeResp}\n\n## **OAIResp:**\n\n${oaiResp}\n\nDONE\n\n`;
writeData(out, outPath);
return `Done w. allThree, output: [${outPath}]`;
}
*/


/**
 * Make array of ChatCompletionMessageParam objects from user & system messages
 * @param msgSrc: string | string[] | IMsgsParams - user & system messages
 * If msgSrc is a string or array of strings, it is used as the user message, and 
 * the default system message is used.
 */
//export function mkMsgArr(uMsgs:string | string[]='', sysMsgs:string | string[]=''):ChatCompletionMessageParam[] {
export async function mkMsgArr(msgSrc: Strings | null | IMsgsParams): Promise<ChatCompletionMessageParam[]> {

  let uMsg:Strings, sMsg:Strings;
  if (isSimpleObject(msgSrc)) {
    ({ uMsg, sMsg } = msgSrc as IMsgsParams);
  } else if ((typeof msgSrc === 'string') || Array.isArray(msgSrc)) {
    uMsg = msgSrc;
    sMsg = 'default';
  } else {
    throw new PkError(`Invalid msgSrc:`, { msgSrc });
  }
  sMsg = mkArray(sMsg);
  uMsg = mkArray(uMsg);
  if (!sMsg.includes('default')) {
    sMsg.unshift('default');
  }




  //console.log(`mkMsgArr:`, { uMsg, sMsg });

  let system = await expandMsgs(...sMsg);
  uMsg = inArr1NinArr2(uMsg, sMsg);
  let user = await expandMsgs(...uMsg, { usedKeys: sMsg });

  // Experimental 



  let msgs: ChatCompletionMessageParam[] = [];
  msgs.push({ role: 'system', content: system });
  msgs.push({ role: 'user', content: user, });
  return msgs;
}
/** Return providers - array of strings or configs
 * @param {boolean} list - if true, return array of strings, else return object
 */
export function getProviders(list = true) {
  if (list) {
    return Object.keys(providers);
  }
  return providers;
}

//export async function mkLogDets(provider, model, msgs) {
interface LogDetails {
  provider: string;
  model: string;
  msgs: Strings;
  sMsg?: Strings; // Optional property with default value later
  chatconfig?: Record<string, any>; // Optional property
}
export async function mkLogDets({ provider, model, msgs, sMsg = 'default', chatconfig = {} }:LogDetails) {
  if (isEmpty(msgs)) {
    let msg = await ask(`What is your question for [${provider}]?`);
    msgs = [msg];
  }
  msgs = mkArray(msgs);
  /*
  if (!Array.isArray(msgs)) {
    msgs = [msgs];
  }
  if (isEmpty(sMsg)) {
    sMsg = 'default';
  }
    */
  sMsg = mkArray(sMsg);
  //let label = msgs[0].substring(0, 25);
  let stamp = mkStamp();
  let usrMsgKeys = stringifyMsgs(msgs);
  //@ts-ignore
  let label = slugify(usrMsgKeys.substring(0, 25));
  let title = `${provider} - ${label}`;
  let sysMsgKeys = stringifyMsgs(sMsg);
  let usrmsg = await expandMsgs(...msgs);
  let sysmsg = await expandMsgs(...sMsg);
  //let divider = '\n\n## Conversation:\n\n=========================================================================\n\n';
  let divider = '\n\n# Conversation:\n\n---\n\n';
  let chatinfo = `[${label}::${provider}:${model}]-${dtFmt('dt')}`;
  let outpath = `./out/chats/${dtFmt('html')}/${label}/${label}--${provider}-${model}-${stamp}.md`;
  writeData(`# ${title}\n\n<title>${title}</title>\n\n
# Chat Session: ${chatinfo}\n\n**chatconfig:**\n\`\`\`\n${JSON5Stringify(chatconfig)}\n\`\`\`\n\n**Init UsrMsgKeys:**\n\`${usrMsgKeys}\`\n\n**SysMsgKeys:**\n\`${sysMsgKeys}\`\n\n**Init User Msg:**\n${usrmsg}\n\n**Sys Msg**:\n${sysmsg}\n\n${divider}\n\n`, outpath);
  return { label, stamp, usrmsg, sysmsg, chatinfo, outpath, sysMsgKeys, usrMsgKeys };
}

export function addRound(outpath:string, round:number, usr?:string, assistant?:string) {
}

/**
 * Takes a msg key or array of msg keys & returns a string of the message keys
 */
export function stringifyMsgs(msgs) {
  msgs = mkArray(msgs);
  if (msgs.length === 1) {
    return msgs[0];
  }
  let msgsStr = `[${msgs.join('][')}]`;
  return msgsStr;
}

export function mkStamp(pre?: string) {
  let ts = Date.now();
  if (pre) {
    return `${pre}-${ts}`;
  } else {
    return `${ts}`;
  }
}


export async function askLlmProvider() {
  let choices = getProviders();
  //@ts-ignore
  let answer = await ask('What LLM Provider to use?', { choices });
  llmProvider = answer;
  console.log({ answer });
  return llmProvider;
};


/**
 * Strips opening & closing backticks from text response
 */
export function stripBackticks(str: string, lbl?: string): string {
  if (isEmpty(str)) {
    return str;
  }
  lbl = lbl || 'typescript';
  let cbts = '```';
  let obts = cbts + lbl;
  if (!(str.startsWith(obts))) {
    return str;
  }
  if (!str.endsWith(cbts)) {
    throw new PkError(`stripBackticks - opend with [${obts}] but not closed. STR: \n\n${str}\n\n`);
  }
  str = str.substring(obts.length);
  str = str.substring(0, str.length - cbts.length);
  return str;
}

