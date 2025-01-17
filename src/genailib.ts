/**
 * Use the Google Generative AI API for text generation
 */


// NPM Imports

//import { VertexAI } from '@google-cloud/vertexai';
import { GoogleGenerativeAI } from "@google/generative-ai";


import mime from 'mime';
import fs from 'fs-extra';
// PK Lib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes,  writeData,  askConfirm, mkArray,
  multiAsk, isEmpty, parseArgs,
} from 'pk-ts-node-lib';

import {
  GenObj, isObject, isSimpleObject, typeOf, typeOfEach, extractOpts,
  allProps, getProps, objInfo, PkError, dtFmt, JSON5Stringify,
} from 'pk-ts-common-lib';

// Local Imports
import {
  getApiKey, 
  systemMessages, usrMessages, providers, timeout, defaultSysMsg, getProviderConfig, parseSingleGeminiResponse,
  //mkMsgStr,
  getLlmProvider,
  expandMsgs, Strings, logEntities, LogItem, initChatLog, mkStamp,  mkLogDets,
} from './init.js';


export async function getGenAIModels(opts: GenObj = {}) {
  let provider = getLlmProvider('gengemini');
  let genAI = await getGenAIClient(provider);
  //const models = await genAI.listModels();
  //console.log(models);
}
export async function genAIChat(msg: Strings = [], opts: GenObj = {}) {
  let defOpts = {
    provider: 'gengemini',
    sMsg: 'default',
    dropSchema: false,
    followup: true,
    forceAsk: false,
  };
  let msgs = mkArray(msg);
  let { provider, sMsg, dropSchema, followup, forceAsk, } = extractOpts(defOpts, opts);
  provider = getLlmProvider(provider);
  let genAI = await getGenAIClient(provider);
  let config = getProviderConfig(provider);
  let generationConfig = config.defaultGenerationConfig;
  let model = config.model;
  if (isEmpty(msgs) || forceAsk) {
    let prompt = await ask("Ask Gemini genAIChat a question: ");
    msgs.push(prompt);
  }
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo } = await mkLogDets({ provider, model, msgs, sMsg });
  let systemInstruction = {
    role: 'system',
    parts: [{ "text": sysmsg, }]
  };
  let chatLog = await initChatLog({ outpath, sysmsg, dropSchema, provider, model, stamp, usrmsg, chatinfo, chatconfig: generationConfig, label, });

  let messages = [{ role: 'user', content:usrmsg, }];
  /*
  let apiKey = getApiKey(provider);
  const genAI = new GoogleGenerativeAI(apiKey);
  */
  const gModel = genAI.getGenerativeModel({
    model, systemInstruction, generationConfig,
  });

  //let chat = await gModel.startChat({});
  let chat = await gModel.startChat();
  let fcnt=0;
  while (true) {
    fcnt++;
    try {
      //const result = await gModel.generateContent(usrmsg);
      const result = await chat.sendMessage(usrmsg);
      let response = result.response;
      let assistant = parseSingleGeminiResponse(result);

      messages.push({role:'assistant', content:assistant});
      await chatLog.addChatItem({ usrmsg, assistant, response, chatinfo, messages, });
      stdOut(`\n\nGemini Response:\n${assistant}\n`);
      writeData(`\n\n**${provider} Assistant:**\n\n${assistant}\n\n`, outpath, true);
      if (followup !== true) { // This is a one-shot chat
        return assistant;
      }

      usrmsg = await ask(`${provider} chat: Followup?`);
      if (!usrmsg) {
        console.log(`Done w. Simple Gemini Chat`);
        break;
      }
      messages.push({role:'user', content:usrmsg});
      writeData(`\n\n---\n\n# Followup ${fcnt}:\n\n**User**: ${usrmsg}\n\n`, outpath, true);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return error;
    }
  }
}

export async function getGenAIClient(provider = "gengemini", opts: GenObj = {}) {
  //let {provider="gengemini",   sMsg, dropSchema, followup,} = opts;
  provider = getLlmProvider(provider);
  //let config = getProviderConfig(provider);
  let apiKey = getApiKey(provider);
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;

}













