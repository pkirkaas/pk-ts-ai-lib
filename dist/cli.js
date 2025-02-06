/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */
// pk-lib imports
import { dbgWrt, ask, runCli, isSimpleObject, PkError, parseArgs, } from 'pk-ts-node-lib';
import { isEmpty, } from 'pk-ts-common-lib';
// local imports
import { codeFiles, processMsgsDB, wrapCodeNew, 
//getModelList, askModel, getModelByIdx, chat, mkMsgArr, getRawModelList,genAIChat,anthropicChat, getModelObjsOai,anthropicChatCached,
getLlmProvider, buildMsg, hfChat, 
//filterTogetherModels, showTogetherModel, showTogetherModels,
OpenAiClient, } from './init.js';
// Implementations
export let msgKeys = {};
export async function parseChatArgs(args, chatOpts = {}) {
    if (typeof chatOpts === 'string') {
        chatOpts = { provider: chatOpts };
    }
    if (!isSimpleObject(chatOpts)) {
        throw new PkError(`chatDefaults must be an object`);
    }
    let optDefaults = { sMsg: 'default', dropSchema: false, forceAsk: false, ...chatOpts };
    let { arr: msgs, opts, } = parseArgs(args, optDefaults);
    if (opts.provider) {
        opts.provider = getLlmProvider(opts.provider);
    }
    if (isEmpty(msgs) || opts.forceAsk) {
        let umsg = await ask(`What to ask?`);
        msgs.push(umsg);
    }
    return { msgs, opts };
}
let fncs = {
    tstHf: async () => {
        let res = await hfChat();
        console.log(res);
    },
    async tstClient(provider = "openai") {
        let client = new OpenAiClient(provider);
        let models = await client.filterModels();
        console.log({ models });
    },
    async tstNewMsg(...args) {
        if (isEmpty(args)) {
            args.push('text-popup');
        }
        let { uMsg, sMsg } = buildMsg(args);
        dbgWrt({ what: "tstBuildMsg", args, uMsg, sMsg, }, 'buildMsg');
        console.log("Tested buildMsg");
    },
    tstWrapCode(key) {
        if (!key) {
            key = "commonlib";
        }
        let srcs = codeFiles[key];
        console.log(`CLI: tstWrapCode: ${key}, srcs:\n`, srcs);
        let res = wrapCodeNew(srcs);
        dbgWrt(res, 'tstWrapCode');
        console.log(`\nDone w. tstWrapCode\n`);
    },
    processMsgs: async (...args) => {
        console.log(`in processMsgs:`, args);
        let res = await processMsgsDB(...args);
        console.log(`\nDone w. processMsgs; res:\n`, res);
    },
    /*
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
      let res = await mkMsgArr(msgs,);
      console.log(`in tstMkMsgArr:`, { res });
    },
  
    rawModels: async (...args) => {
      let provider = args[0] || 'gengemini';
      provider = getLlmProvider(provider);
      console.log(`in rawModels:`, { provider });
      let models = await getRawModelObjs(provider);
      let fpath = `./tmp/${provider}-models.json5`;
      let wrtPath = writeData(models, fpath);
      console.log(`in rawModels for [${provider}] - written to: [${wrtPath}]:`, { models });
    },
  
  
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
    */
};
await runCli(fncs);
console.log('\ndone\n\n');
//# sourceMappingURL=cli.js.map