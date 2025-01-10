/**
 * CLI Index to run the AI Agents
 */

// npm lib imports

import OpenAI from "openai";
import {editor} from '@inquirer/prompts';
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions.js";
//import SDK from '@lmstudio/sdk';
//const { LMStudioClient } = SDK;

// pk-lib imports

import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, argv, dbgWrite, isSimpleObject, PkError, multiAsk,
  writeData, writeFile, pkToDate, dtFmt,
} from 'pk-ts-node-lib';

import { mergeAndConcat, isEmpty, typeOf, typeOfEach, allProps, getProps, allPropsWithTypes, objInfo, } from 'pk-ts-common-lib';


// local imports
import {
  askLlmProvider, getServerUrl, getModelList, askModel, getLlmProvider, getModelByIdx, getOaiClient, getProviders, parseChatRes,  chat, mkMsgArr, getRawModelObjs, getRawModelList, 
  //chatTask,
  //geminiChat,
 anthropicChat, hfChat, initFncDets, getDbPath, FunctionDets, tstMsgStr, fncTask, getEmptyFncMD,
  getCommonTs, getTxtMsg, systemMessages, providers, timeout, 
 // claudeChatTask,
  validateJson, mkArray, getByName, getFncsMD,
  populateBody, populateBodies, fncNameMsg, expandMsgs, 
  //mkMsgStr,
  tstMsgKeys, dbReport,
  // tstFncJsons,
  filterTogetherModels, showTogetherModel, showTogetherModels,
  //oaiChatTask,
  allThree,
  mkTogetherModelChoices, askTogetherModel, getTxtMsgs, AllMsgs, sGeminiChat, wrappedSchemaStr, 
} from './init.js';

// Implementations


let fncs = {
  tstEd: async() => {
    console.log("Testing Editor");
    let ed = await editor({
      message: "Edit me!",
      default: "Hello World!",
    });
    console.log("Editor Result:", ed);
  },
  dbRep: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let model = await askModel(provider);
    await dbReport({provider,model});
  },
  logFncs: async  (provider='anthropic')  => {
    console.log(`Logging all FNC Dets w. provider: [${provider}]`);
    let ret = await getFncsMD({provider});
    dbgWrt(ret);
    console.log(`Finished logging fnc dets`);
  },
  /*
  tstGetFncDets: async (provider = 'anthropic', arr = 5) => {
    console.log(`Testing FNC Dets w. provider: [${provider}] with [${arr}] functions`);
    let i = 10;
    //let i = 1;
    while (i > 0) {
      i--;
      //let empties = await getEmptyFncMD({provider}) as FunctionDets;
      //let empties = await getEmptyFncMD({provider, arr}) as FunctionDets;
      let empties = await getEmptyFncMD({ provider, arr });
      if (!empties) {
        console.log(`No empty function returned - Done??`);
        return;
      }
      empties = mkArray(empties);
      //let fncName = empty.name;
      //let msgArr = fncTask(fncName);
      let msgArr = fncTask(empties);
      //let tstRes = tstMsgStr(msgArr);
      //console.log(tstRes);
      //return;
      let ans = await claudeChatTask(msgArr);
      console.log(`Got Claude response -  process...`);
      let cres = mkArray(JSON.parse(ans));
      for (let empty of empties as any[]) { //(entries as any[])) {
        let name = empty.name;
        try {
          let meta = getByName(cres, name);
          let res = validateJson(meta);
          if (typeof res === 'string') {
            res = JSON.parse(res);
          }
          if (!isSimpleObject(res)) {
            throw new PkError(`Bad type of res for [${name}]`, { ans, res });
          }
          empty.metadata = res;
          let succ = await empty.save();
          console.log(`Success for fncName: [${name}]`,);
        } catch (e) {
          console.log(`Exception for fnc [${name}]`, e);
          empty.error = e;
          await empty.save();
        }
      }
    }
  },
  */

  tstFncTask: async (fncName = 'allProps') => {
    let msgArr = fncTask(fncName);
    let res = tstMsgStr(msgArr);
    console.log(`Res of fncTask for [${fncName}]:`, { res });
  },

  /*
  tstOAItask: async () => {
    let res = await oaiChatTask(['default', 'tsTypes']);
    console.log(res);
  },
  */

  tstAllThree: async (...msgs) => {
    //let msgs = ['default', 'functionSchema', 'fncSchema1'];
    //let msgs = ['default', 'tstGen', getCommonTs(), 'fncSchema2', 'Execute this request now and return the JSON for the named function `allProps`'];
    if (!msgs.length) {
      msgs = ['embeddings'];
    }
    console.log(`Msgs:`, msgs);
    let res = await allThree(msgs);
    console.log(res);
  },
  anthropic: async (...msgs) => {
    if (isEmpty(msgs)) {
      msgs = ['default', 'tsTypes'];
    }
    //let resp = await anthropicChat(['default', 'claudeApi']);
    let resp = await anthropicChat(['default', 'tsTypes']);
    console.log(resp);
  },
  sGemini: async (...msgs) => {
    let resp = await sGeminiChat(['default', 'tsTypes']);
    console.log(resp);
  },
  tstMsgKeys: (...msgs) => {
    console.log(`tstMsgKeys - msgs:`, msgs);
    let res = tstMsgKeys(msgs);
    console.log(res);
  },
  tstMsgStr: (...msgs) => {
    //msgs = ['default', 'tstGen', getCommonTs(), 'fncSchema2', 'Execute this request now and return the JSON for the named function `allProps`'];
    if (!msgs.length) {
      msgs = ['embeddings'];
    }
    console.log(`Msgs:`, msgs);
    // return;
    let msgStr = tstMsgStr(msgs);
    console.log(`tstMsgStr Res:\n${msgStr}`);
  },
  tstsGC: async () => {
    let msgArr = ['ai', 'default', 'function-schema'];
    //let msg = mkMsgStr(msgArr);
    //console.log(msg);
    let resp = await sGeminiChat(msgArr);
    console.log(resp);
  },
  tstGM: async () => {
    //    let msgs = getTxtMsgs();

    //let msg = mkMsgStr(['function-schema', 'default', 'not fnd']);
    let msg = await expandMsgs(['function-schema', 'default', 'not fnd']);
    stdOut(msg);
    //dbgWrt(AllMsgs);
    //console.log(`Got txt msgs:`, AllMsgs);
  },
  tstClaude: async (msg: string) => {
    if (!msg) {
      msg = await ask('Enter a message to send to Claude:');
    }
    let res = await anthropicChat(msg);
    let toRes = typeOf(res);
    console.log(`\nDone w. Claude, TORes: [${toRes}] res:\n`, { res });
  },
  /*
  tstGemini: async (msg: string) => {
    if (!msg) {
      msg = await ask('Enter a message to send to Gemini:');
    }
    let res = await geminiChat(msg);
    let toRes = typeOf(res);
    console.log(`\nDone w. Gemini, TORes: [${toRes}]; res:\n`, { res });
  },
  askTogetherModel: async () => {
    let model = await askTogetherModel({});
    console.log(`Got Together model: [${model}]`);
    let provider = 'together';
    let sMsg = `You are a helpful assistant.`;
    let uMsg = `What is the capital of Germany?`;
    let msgs = mkMsgArr({ sMsg, uMsg });
    let res = await chatTask({provider, model, msgs});
    console.log(`\nDone w. Chat w. together, res:\n`, { res });
  },
  */
  tstGetMsg: async (provider = 'lms') => {
    let uMsg = getTxtMsg(`function-schema`);
    let res = await chat(provider, { sMsg: ['ai', 'ts'], uMsg });
    console.log(`res:\n`, res);
  },
  allTogetherModels: async () => {
    let models = await filterTogetherModels({ type: 'chat' });
    let fpath = "./tmp/all-together-models.json5";
    let len = models.length;
    console.log(`About to write ${len} models to ${fpath}`);
    writeData(models, fpath);
    let choices = mkTogetherModelChoices(models);
    console.log(`Done w. allTogetherModels - the choices:`, choices);

    //console.log( len);
  },
  tstDtFmt: () => {
    console.log(`\n\nTesting dtFmt\n`);
    let dtStrs = [
      "22 Dec 23",
      "Jan 1 2024",
      "2024-01-01",
      "1 June 2024",
    ];
    for (let dtStr of dtStrs) {
      let dt = pkToDate(dtStr);
      let dtFmtStr = dtFmt('short', dt);
      console.log(`src DT: [${dtStr}], fmt Dt: [${dtFmtStr}]`);
    }
    console.log('Done w. dtFmt\n\n');
  },
  tstFltTgth: async (name, date, context, org) => {
    date = date || "1 June 2024";
    //let provider = 'together';
    //let model = await askModel(provider);
    let res = await filterTogetherModels({
      name, context, org, type: 'chat', //price:.2, 
      date
    });
    let len = res.length;
    let show = showTogetherModels(res);
    let shLen = show.length;
    console.log(show, len, shLen);
  },
  checkModels: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let models = await getRawModelObjs(provider);
    console.log(`For Provider [${provider}] models are:`, models);
    return;
  },
  tstMkMsgArr: () => {
    let uMsg = ['tsfncbody', getCommonTs()];
    let sMsg = ['ts', 'tsfncbody'];
    let msgRes = mkMsgArr({ uMsg, sMsg });
    console.log(msgRes);
  },

  tstPopFnc: async (provider = 'lms', fncName = 'allProps') => {
    provider = getLlmProvider(provider);
    let model = await askModel(provider);
    let res = await populateBody({provider, model, fncName});
    writeData(res, './out/msg-arr.json5');
  },
  tstPopBodies: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let model = await askModel(provider);
    let res = await populateBodies({provider, model});
    writeData(res, './out/msg-arr.json5');
    console.log("Done pop bodies");
  },
  initDecTbl: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let model = await askModel(provider);
    console.log(`About to run initFncDets (TO) for provider [${provider}]`);
    let res = await initFncDets(provider, model);
    console.log(`\nDone w. Chat\n`);
  },
  tstHf: async () => {
    let res = await hfChat();
    console.log(res);
  },
  tstFncDef: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let uMsg = ['tsfncbody', getCommonTs()];
    let sMsg = ['ts', 'tsfncbody'];
    let res = await chat(provider, { sMsg, uMsg });
    console.log(`\nDone w. Chat\n`);
  },

  tstFncsNoBody: async (provider = 'lms') => {
    provider = getLlmProvider(provider);
    let model = await askModel(provider);
    let ds = await initFncDets(provider, model);
    let emptyFncs = await FunctionDets.fncsNoBody();
    console.log(emptyFncs);
    console.log(`\nDone w. Chat\n`);
  },
  getDecls: async (provider = 'lms') => {
    console.log(`About to run getDecls for provider [${provider}]`);
    let res = await chat(provider, { sMsg: 'ts', uMsg: ['tsdecls', getCommonTs()] });
    console.log(`\nDone w. Chat\n`);
  },

  chatOAI: async ( ...msgs: string[]) => {
    let provider = 'openai';
    let res = await chat(provider, msgs);
    console.log(`\nDone w. OAI Chat\n`);

  },
  chat: async (provider = 'lms', sMsg = 'ai', uMsg?: string) => {
    if (!uMsg) {
      uMsg = await ask('Enter a message to send to the AI');
    }
    if (!uMsg) {
      console.log('No message to send to AI');
      return;
    }
    let res = await chat(provider, { sMsg, uMsg });
    console.log(`\nDone w. Chat\n`);
  },

};

await runCli(fncs);
console.log('\ndone\n\n');