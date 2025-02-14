/**
 * More tests....
 */
//PkLib Imports
import { ajvSchema, runCli, multiAsk, stdOut, } from 'pk-ts-node-lib';
// Local Imports
import { getLogDS, LogItem,
//  wrapCode,
//  getAllFiles, 
// wrapCodeDir,
 } from './init.js';
// JSON Imports
import geminiAllProps from './allPropsJsons/GeminiAllProps.json' with { type: "json" };
import claudeAllProps from './allPropsJsons/ClaudeAllProps.json' with { type: "json" };
import oaiAllProps from './allPropsJsons/OAIAllProps.json' with { type: "json" };
import fncSchema from './FncSchemas/fnc2schema.json' with { type: 'json' };
/**
 * Validates JSON schema itself, then the JSON results from OpenAI, Gemini & Claude
 */
export function tstFncJsons() {
    let jsons = { geminiAllProps, claudeAllProps, oaiAllProps };
    console.log(`Validating fncSchema iteself`);
    let validate = ajvSchema(fncSchema);
    console.log(`Schema itself validate, now validate individual jsons`);
    for (let key in jsons) {
        let json = jsons[key];
        if (validate(json)) {
            console.log(`The [${key}] json is valid`);
        }
        else {
            console.log(`Validation of [${key}] return errors:`);
            console.log(validate.errors);
        }
    }
    console.log(`Validation finished`);
}
export async function tstDbLog() {
    let ds = await getLogDS();
    let data = {
        model: 'TstModel',
        agent: 'Gemini',
        config: { a: "chat-config" },
    };
    let li = LogItem.create(data);
    let res = await li.save();
    return res;
}
let fncs = {
    tstRL: async (prompt) => {
        if (!prompt) {
            prompt = 'Def Say what?';
        }
        let res = await multiAsk(prompt);
        console.log(`Done w. tstRL, res:`, { res }, 'resOut:');
        stdOut(res);
    },
    tstDbgLog: async () => {
        console.log(`About to init dbLog`);
        let lgRes = await tstDbLog();
        console.log(`Done w. tstDbLog, res:`, { lgRes });
    },
    tstFncJsons: async () => {
        let res = tstFncJsons();
        console.log(`Done w. tstFncJsons, res:`, { res });
    },
};
await runCli(fncs);
//# sourceMappingURL=test.js.map