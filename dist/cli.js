/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
 */
// pk-lib imports
import { dbgWrt, runCli, } from 'pk-ts-node-lib';
import { isEmpty, } from 'pk-ts-common-lib';
// local imports
import { tstZodSchemas, askMsg, tstMsgs, wrapCodeNew, buildMsg, hfChat, OpenAiClient, } from './init.js';
// Implementations
export let msgKeys = {};
let fncs = {
    tstZod: (...args) => {
        let schemas = tstZodSchemas(args);
        console.log({ schemas });
    },
    tstMsgs: () => {
        tstMsgs();
    },
    askMsg: async (...smsgs) => {
        console.log(`Ask user msg for sysmsg`);
        let bMsg = await askMsg(smsgs);
        console.log(`Built Msg:`, { bMsg });
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
    async tstMsg(...args) {
        if (isEmpty(args)) {
            args.push('text-popup');
        }
        let { uMsg, sMsg } = buildMsg(args);
        let outPath = dbgWrt({ what: "tstBuildMsg", args, uMsg, sMsg, }, 'buildMsg');
        console.log(`Tested buildMsg to [${outPath}] with args:`, { args });
    },
    tstWrapCode(key) {
        if (!key) {
            key = "commonlib";
        }
        //let srcs = codeFiles[key];
        //console.log(`CLI: tstWrapCode: ${key}, srcs:\n`, srcs);
        console.log(`CLI: tstWrapCode: ${key}`);
        let res = wrapCodeNew(key, true);
        dbgWrt({ key, res, }, 'tstWrapCode');
        console.log(`\nDone w. tstWrapCode\n`);
    },
};
await runCli(fncs);
console.log('\ndone\n\n');
//# sourceMappingURL=cli.js.map