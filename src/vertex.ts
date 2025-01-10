/**
 * Use of Google Vertex AI to generate text.
 */

// NPM Imports

import { VertexAI } from '@google-cloud/vertexai';

import mime from 'mime';
import fs from 'fs-extra';
// PK Lib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, dbgWrite, writeData, writeFile, askConfirm,
  multiAsk, isEmpty, parseArgs,
} from 'pk-ts-node-lib';

import {
  GenObj, isObject, isSimpleObject, typeOf, typeOfEach,
  allProps, getProps, objInfo, PkError, dtFmt, JSON5Stringify,
} from 'pk-ts-common-lib';

// Local Imports
import {
  systemMessages, usrMessages, providers, timeout,  defaultSysMsg, getProviderConfig, 
  //mkMsgStr,
  expandMsgs, Strings, logEntities, LogItem, initChatLog, mkStamp,  mkLogDets,
} from './init.js';

/**
 * Simple gemini chat - with interactions...
 */
export async function sGeminiChat(...args) {
  let {arr:msgs, opts} = parseArgs(args);
  let {sMsg= 'default',  dropSchema=false, followup,} = opts;
  let provider = 'gemini';
  let config = getProviderConfig(provider);
  let model = config.model;
  //let chatinfo = `[Gemini-Chat-s-${dtFmt('dt')}]`;
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo } = await mkLogDets({provider, model, msgs, sMsg});
  //let {label, stamp, outpath, usrmsg, sysmsg, } = await mkLogDets({provider, model, msgs, sMsg,});

  let vertexAI = new VertexAI({
    project: config.project,
    location: config.location,
  });
  let systemInstruction = {
      role: 'system',
      parts: [{"text": sysmsg,}]
    };
  let gmodel = vertexAI.getGenerativeModel({ 
    model,
    systemInstruction,
    generationConfig:config.defaultGenerationConfig,
   });
  let chatLog = await initChatLog({outpath, sysmsg, dropSchema, provider, model, stamp, usrmsg, chatinfo, chatconfig:config.defaultGenerationConfig, label,});
  //writeData(`# Chat Session: ${chatinfo}\n\n**Init Msg:**\n${usrmsg}\n\n`, outpath);
  let chat = await gmodel.startChat({});
  while (true) {
    let result = await chat.sendMessage(usrmsg);
    let response = result.response;
    let assistant = parseSingleGeminiResponse(result);
    await chatLog.addChatItem({usrmsg, assistant, response,});
    stdOut(`\n\nGemini Response:\n${assistant}\n`);
    writeData(`\n**Assistant:**\n${assistant}\n\n`, outpath, true);
    usrmsg = await ask(`${provider} chat: Followup?`, {type:followup,});
    if (!usrmsg) {
      console.log(`Done w. Simple Gemini Chat`);
      break;
    }
    writeData(`\n**Followup:**\n${usrmsg}\n\n`, outpath, true);

  }
}

export async function geminiChatTask(...msgs) {
  if (isEmpty(msgs)) {
    let msg = await ask("Enter your message to Gemini:");
    msgs.push(msg);
  }
  let label = msgs[0];
  let stamp = mkStamp();
  //let content = mkMsgStr(msgs);
  let content = await expandMsgs(msgs);
  let provider = 'gemini';
  let providerConfig = getProviderConfig(provider);
  let vertexAI = new VertexAI({
    project: providerConfig.project,
    location: providerConfig.location,
  });
  let model = providerConfig.model;
  let config =   providerConfig.defaultGenerationConfig;
  let chatModel = vertexAI.getGenerativeModel({ 
    model,
    generationConfig:config,
   });
  let chat = await chatModel.startChat({});
  let result = await chat.sendMessage(content);
  let response = result.response;
  let assistant = parseSingleGeminiResponse(result);
  let logItem = LogItem.create({
    response, assistant, model, provider, config, content, messages:content,
  });
  await logItem.save();
  return assistant;
}

export function parseSingleGeminiResponse(result) {
  let response = result.response;
  let candidates = response.candidates;
  let cLen = candidates.length;
  if (cLen === 1) {
    let content = candidates[0].content;
    let parts = content.parts;
    let pLen = parts.length;
    if (pLen === 1) {
      return parts[0].text;
    }
    return parts;
  }
  return candidates;
}

/** TODO - flesh out - use sGeminiChat for now*/

/*
export async function geminiChat(msg: Strings) {
  let config = getProviderConfig('gemini');
  let vertexAI = new VertexAI({
    project: config.project,
    location: config.location,
  });
  let model = config.model;
  let gmodel = vertexAI.getGenerativeModel({ model, generationConfig:defaultGenerationConfig });
  const request = mkGeminiRequest(msg);
  let outPath = `./out/gemini-chat-stream-${Date.now()}.md`;
  let chatInfo = `[Gemini-Chat-${dtFmt('dt')}`;
  writeData(`# Chat Session: ${chatInfo}\n\n**Init Msgs:**\n${JSON5Stringify(request)}\n\n`, outPath);
  let result = await gmodel.generateContent(request);
  let response = result.response;
  let candidates = response.candidates;
  let cLen = candidates.length;
  if (cLen === 1) {
    let content = candidates[0].content;
    let parts = content.parts;
    let pLen = parts.length;
    if (pLen === 1) {
      return parts[0].text;
    }
    return parts;
  }
  return candidates;
}
  */

//export function mkGeminiMsg
//export interface TextContent: string | stri
export interface FileContent {
  type:string,
  url: string,
}
export interface GeminiContentsParam {
  text?:Strings,
  inline?:Strings,
  file?: FileContent | FileContent[],
};



/**
 * Make contents portion of Gemini Vertex Request
 * @param msg - string | string[] if just message
 * GeminiContentsParam if want to include file data
 */
//export function mkGeminiRequest(msg: string | string[] | GeminiContentsParam) {
export async function mkGeminiRequest(msg: string | string[] | GeminiContentsParam) {
  let text:string = '';
  let parts:any[] = [];
  if ((typeof msg === "string") || Array.isArray(msg)) {
    msg = {text:msg};
  }
  if (!isSimpleObject(msg)) {
    throw new PkError (`Invalid msg to mkGeminiContents:`,msg);
  }
  if ('text' in msg) {
    //msg.text = mkMsgStr(msg.text);
    msg.text = await expandMsgs(msg.text);
  }
  parts.push(msg);
  let request = {
    //contents: [{ role: 'user', parts: [{ text: msg }] }],
    contents: [{ role: 'user', parts }],
  };
  return request;
}