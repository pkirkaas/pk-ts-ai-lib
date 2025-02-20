/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */

// npm lib imports

import _ from "lodash";

// pk-lib imports

import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, argv, isSimpleObject, PkError, multiAsk, parseArgs, getArrArgs, getObjArg, askConfirm,
  writeData, pkToDate, dtFmt, GenObj,
} from 'pk-ts-node-lib';

import { mergeAndConcat, isEmpty, typeOf, typeOfEach, allProps, getProps, allPropsWithTypes, objInfo, } from 'pk-ts-common-lib';


// local imports
import {
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
} from './init.js';

// Implementations

export let msgKeys = {

};


let fncs = {
  tstZod:(...args) => {
    let schemas = tstZodSchemas(args);
    console.log({schemas});
  },
  tstMsgs:() => {
    tstMsgs();
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
    let {uMsg, sMsg} = buildMsg(args);
    let outPath = dbgWrt({what:"tstBuildMsg", args, uMsg, sMsg,}, 'buildMsg' );
    console.log(`Tested buildMsg to [${outPath}] with args:`,{args});
  },
  tstWrapCode(key?: string) {
    if (!key) {
      key = "commonlib";
    }
    let srcs = codeFiles[key];
    console.log(`CLI: tstWrapCode: ${key}, srcs:\n`, srcs);
    let res = wrapCodeNew(srcs, true);

    dbgWrt({key,res,}, 'tstWrapCode');
    console.log(`\nDone w. tstWrapCode\n`);

  },

};

await runCli(fncs);
console.log('\ndone\n\n');
