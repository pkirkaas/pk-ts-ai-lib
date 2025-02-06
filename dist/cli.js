/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */
// pk-lib imports
import { dbgWrt, ask, runCli, isSimpleObject, PkError, parseArgs, } from 'pk-ts-node-lib';
import { isEmpty, } from 'pk-ts-common-lib';
// local imports
import { codeFiles, tstMsgs, wrapCodeNew, getLlmProvider, buildMsg, hfChat, OpenAiClient, } from './init.js';
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
    tstMsgs: () => {
        tstMsgs();
    },
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
};
await runCli(fncs);
console.log('\ndone\n\n');
//# sourceMappingURL=cli.js.map