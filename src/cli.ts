/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */

// npm lib imports

import _ from "lodash";
import { zodToJsonSchema } from 'zod-to-json-schema';

// pk-lib imports

import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, argv, isSimpleObject, PkError, multiAsk, parseArgs, getArrArgs, getObjArg, askConfirm, 
  writeData, pkToDate, dtFmt, GenObj,
} from 'pk-ts-node-lib';

import { JSON5Stringify, mergeAndConcat, isEmpty, typeOf, typeOfEach, allProps, getProps, allPropsWithTypes, objInfo, } from 'pk-ts-common-lib';


// local imports
import {

  sysMsgs, decompSchema,
  tstZodSchemas, tstZods,
  codeFiles, askMsg,
  tstMsgs,
  initMsgsDB, //processMsgsDB,
  WrapCodeParam, WrapCodeParams,wrapCodeNew,
  askLlmProvider,
  getLlmProvider, getOaiClient, getProviders, parseChatRes, getRawModelObjs,
   buildMsg,
   hfChat, initFncDets, getDbPath, FunctionDets,
  getEmptyFncMD,  //findEmbeddeds,
  systemMessages, providers, timeout,
  validateJson,  getFncsMD,
  dbReport, OpenAiClient,ClaudeClient,
  logPretty, sdkFileMsg,
} from './init.js';

// Implementations

export let msgKeys = {

};


let fncs = {
  tZod:() => {
    let jsSchema = zodToJsonSchema(decompSchema);
    console.log(jsSchema);
  },
  fMsg:() => {
    let fpath = "C:/www/TypeScriptLibs/Pk-Ts-Node/src/index.ts";
    let fmsg = sdkFileMsg(fpath);
    console.log({fmsg});
  },
  tstZod:(...args) => {
    let schemas = tstZodSchemas(args);
    console.log({schemas});
  },
  tstMsgs:() => {
    tstMsgs();
  },
  sysMsgs: async (sMsg?:string) => {
    console.log(`All sysMsg keys, or expanded sysMsg for key [${sMsg}]`);
    let res = await sysMsgs(sMsg);
    console.log(res);
  },
  askMsg: async (...smsgs) => {
    console.log(`Ask user msg for sysmsg`);
    let bMsg = await askMsg(smsgs);
    console.log(`Built Msg:`,{bMsg});
  },
  tstHf: async () => {
    let res = await hfChat();
    console.log(res);
  },
  async tstClient(provider="openai") {
    let client = new OpenAiClient(provider);
    let models = await client.filterModels();
    console.log({models});
  },
  async tstMsg(...args) {
    if (isEmpty(args)) {
      args.push('text-popup');
    }
    let {uMsg, sMsg, msgKeys} = buildMsg(args);
    let outPath = dbgWrt({what:"tstBuildMsg", args, uMsg, sMsg, msgKeys,}, 'buildMsg' );
    //console.log(`Built Msg:`,{msgKeys,sMsg,uMsg});
    logPretty({msgKeys,sMsg,uMsg});
//    console.log(sMsg);
//    stdOut(JSON5Stringify({msgKeys,sMsg,uMsg}));
    console.log(`Tested buildMsg to [${outPath}] with args:`,{args});
  },
  tstWrapCode(key?: string) {
    if (!key) {
      key = "commonlib";
    }
    //let srcs = codeFiles[key];
    //console.log(`CLI: tstWrapCode: ${key}, srcs:\n`, srcs);
    console.log(`CLI: tstWrapCode: ${key}`,);
    let res = wrapCodeNew(key, true);

    dbgWrt({key,res,}, 'tstWrapCode');
    console.log(`\nDone w. tstWrapCode\n`);

  },

};

await runCli(fncs);
console.log('\ndone\n\n');
