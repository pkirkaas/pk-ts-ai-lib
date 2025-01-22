/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */
//import SDK from '@lmstudio/sdk';
//const { LMStudioClient } = SDK;
// pk-lib imports
import { dbgWrt, ask, runCli, stdOut, isSimpleObject, PkError, parseArgs, writeData, } from 'pk-ts-node-lib';
import { isEmpty, } from 'pk-ts-common-lib';
// local imports
import { codeFiles, initMsgsDB, processMsgsDB, wrapCodeNew, getModelList, getLlmProvider, chat, mkMsgArr, getRawModelObjs, 
//chatTask,
mkTogetherModelChoices, AllMsgs, sGeminiChat, 
//geminiChat,
genAIChat, getAllMsgsByObj, buildMsg, hfChat, expandMsgs, findEmbeddeds, getModelObjsOai, 
// tstFncJsons,
filterTogetherModels, //getExpandedMsgs,
anthropicChatCached, } from './init.js';
// Implementations
export let msgKeys = {};
export async function parseChatArgs(args, chatOpts = {}) {
    if (typeof chatOpts === 'string') {
        chatOpts = { provider: chatOpts };
    }
    if (!isSimpleObject(chatOpts)) {
        throw new PkError(`chatDefaults must be an object`);
    }
    //if (isEmpty
    let optDefaults = { sMsg: 'default', dropSchema: false, forceAsk: false, ...chatOpts };
    let { arr: msgs, opts, } = parseArgs(args, optDefaults);
    //let { filter, provider, sMsg = 'default', dropSchema = false, forceAsk = false, } = opts;
    if (opts.provider) {
        opts.provider = getLlmProvider(opts.provider);
    }
    if (isEmpty(msgs) || opts.forceAsk) {
        let umsg = await ask(`What to ask?`);
        msgs.push(umsg);
    }
    return { msgs, opts };
}
let tstSrcs = {
    common1: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Common", desc: 'Common1', root: 'C:/www/TypeScriptLibs/Pk-Ts-Common',
        excPatterns: ['/tstcli', '.md', '/References/',],
    },
    //common2: ["C:/www/TypeScriptLibs/Pk-Ts-Common"],
};
let fncs = {
    async tstNewMsg(...args) {
        if (isEmpty(args)) {
            args.push('text-popup');
        }
        let res = buildMsg(...args);
        dbgWrt(res);
        console.log(res);
    },
    tstWrapCode(key) {
        if (!key) {
            key = "commonlib";
        }
        let srcs = codeFiles[key];
        console.log(`CLI: tstWrapCode: ${key}, srcs:\n`, srcs);
        let res = wrapCodeNew(srcs);
        /*
        let res:GenObj = {};
        for (let key in tstSrcs) {
          let srcs = tstSrcs[key];
           let outstr = res[key] =  wrapCodeNew(srcs);
           stdOut(outstr);
          //console.log({key,srcs});
        }
          */
        dbgWrt(res, 'tstWrapCode');
        console.log(`\nDone w. tstWrapCode\n`);
    },
    /*
    txtMsgs: async (...args) => {
      let txtMsgs = await getTxtMsgs();
      let tmK = Object.keys(txtMsgs);
  
      console.log({tmK},`\nDone w. getTxtMsgs\n`);
    },
    */
    initMsgs: async (...args) => {
        console.log(`in initMsgs:`, args);
        let res = await initMsgsDB(true);
        console.log(`\nDone w. InitMsgs\n`);
    },
    processMsgs: async (...args) => {
        console.log(`in processMsgs:`, args);
        let res = await processMsgsDB(...args);
        console.log(`\nDone w. processMsgs; res:\n`, res);
    },
    chatGemini: async (...args) => {
        let { msgs, opts, } = await parseChatArgs(args, { provider: "gengemini" });
        console.log(`in genAIChat:`, { msgs, opts });
        let res = await genAIChat(msgs, opts);
        console.log(`in genAIChat:`, { res });
    },
    chatGrok: async (...args) => {
        let { msgs, opts, } = await parseChatArgs(args, { provider: "grok" });
        let res = await chat(...msgs, opts);
        console.log(`\nDone w. GROK Chat\n`);
    },
    tstMkMsgArr: async (...args) => {
        let { msgs, opts, } = await parseChatArgs(args, { provider: "openai" });
        msgs.push('default');
        console.log(`in tstMkMsgArr:`, { msgs, opts });
        let res = await mkMsgArr(msgs);
        console.log(`in tstMkMsgArr:`, { res });
    },
    tstMsgs: async (...args) => {
        let res = getAllMsgsByObj();
        let keys = Object.keys(res);
        let fpath = "./tmp/expanded-by-type-3.json5";
        writeData(res, fpath);
        console.log(`in tstMsgs:`, { keys });
    },
    rawModels: async (...args) => {
        let provider = args[0] || 'gengemini';
        provider = getLlmProvider(provider);
        console.log(`in rawModels:`, { provider });
        let models = await getRawModelObjs(provider);
        //let fpath = "./tmp/gemini-models.json5";
        let fpath = `./tmp/${provider}-models.json5`;
        let wrtPath = writeData(models, fpath);
        console.log(`in rawModels for [${provider}] - written to: [${wrtPath}]:`, { models });
    },
    //chatOAI: async ( ...msgs: string[]) => {
    chatOAI: async (...args) => {
        let { msgs, opts, } = await parseChatArgs(args, { provider: "openai" });
        let res = await chat(...msgs, opts);
        console.log(`\nDone w. OAI Chat\n`);
    },
    chatAnthropic: async (...args) => {
        let { msgs, opts } = await parseChatArgs(args);
        //let resp = await anthropicChat(...msgs,opts);
        let resp = await anthropicChatCached(...msgs, opts);
        console.log(resp);
    },
    chatSGemini: async (...args) => {
        let { msgs, opts } = await parseChatArgs(args);
        //let { arr: msgs, opts } = parseArgs(args);
        let resp = await sGeminiChat(...msgs, opts);
        console.log(resp);
    },
    tstEmbedded: () => {
        let tst = AllMsgs.python;
        let res = findEmbeddeds(tst);
        console.log(tst, '\n', res);
    },
    //getModelList: async (provider?: string, ...args) => {
    getModelList: async (...args) => {
        console.log(`in getModelList:`, { args });
        let { arr, opts } = parseArgs(args);
        let provider = arr[0] || 'openai';
        provider = getLlmProvider(provider);
        let res = await getModelList(provider, opts);
        console.log(`Model List for ${provider}:`, res);
    },
    /*
    getExpandedMsgs: (...args) => {
      let res = getExpandedMsgs(...args);
      let keys = Object.keys(res);
      let fpath = "./tmp/expanded-msgs-3.json5";
      writeData(res, fpath);
      let short = {};
      for (let k of keys) {
        short[k] = res[k].slice(0, 20);
      }
      console.log(short);
    },
    */
    getModelObjsOai: async (provider, ...args) => {
        provider = provider || 'openai';
        provider = getLlmProvider(provider);
        let { opts } = parseArgs(args);
        //let res = await getModelObjsOai(provider,{format:false, filter:'4o', sort:true});
        let res = await getModelObjsOai(provider, { filter: '4o' });
        console.log(`Models for ${provider}:`, res);
    },
    tstMsgStr: async (...args) => {
        let { arr: msgs, opts } = parseArgs(args, {});
        //msgs = ['default', 'tstGen', getCommonTs(), 'fncSchema2', 'Execute this request now and return the JSON for the named function `allProps`'];
        /*
        if (!msgs.length) {
          msgs = ['embeddings'];
        }
          */
        console.log(`Msgs:`, msgs, `opts:`, opts);
        // return;
        //let msgStr = tstMsgStr(msgs);
        //let msgStr = mkMsgStr(...msgs);
        let msgStr = await expandMsgs(...msgs, opts);
        let fpath = "./tmp/expanded-msgStr-1.json5";
        writeData({ msgs, msgStr }, fpath);
        //let msgStr = expandMsg(msgs[0]);
        console.log(`tstMsgStr Res in: ${fpath}`);
        stdOut(msgStr);
    },
    tstArgs: (...args) => {
        let fst = args[0];
        let { arr, opts } = parseArgs(args);
        console.log(`Args:`, args, `\nOpts:\n`, opts, `\nArr:\n`, arr, `\nfst: `, fst);
    },
    allTogetherModels: async () => {
        let models = await filterTogetherModels({ type: 'chat' });
        let fpath = "./tmp/all-together-models.json5";
        let len = models.length;
        //console.log(`About to write ${len} models to ${fpath}`);
        writeData(models, fpath);
        let choices = mkTogetherModelChoices(models);
        console.log(`Done w. allTogetherModels - the choices:`, choices, `Wrote ${len} models to ${fpath}`);
    },
    checkModels: async (provider = 'lms') => {
        provider = getLlmProvider(provider);
        let models = await getRawModelObjs(provider);
        console.log(`For Provider [${provider}] models are:`, models);
        return;
    },
    tstHf: async () => {
        let res = await hfChat();
        console.log(res);
    },
    /*
    askTogetherModel: async (...args) => {
      let {arr, opts} = parseArgs(args);
      let model = await askTogetherModel({opts});
      console.log(`Got Together model: [${model}]`);
      let provider = 'together';
      let sMsg = `You are a helpful assistant.`;
      let uMsg = `What is the capital of Germany?`;
      let msgs = mkMsgArr({ sMsg, uMsg });
      let res = await chatTask({provider, model, msgs});
      console.log(`\nDone w. Chat w. together, res:\n`, { res });
    },
    */
    /*
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
    */
};
await runCli(fncs);
console.log('\ndone\n\n');
//# sourceMappingURL=cli.js.map