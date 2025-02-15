/**
 * Use Commander for CLI script
 */
// NPM Imports
import { Command } from 'commander';
import { z } from 'zod';
// Exports & implementations
export const StringArraySchema = z.string().array();
export const FuncSigSchema = z.object({
    functionName: z.string().describe('Exported function name'),
    functionSignatures: z.string().array().describe('Array of all signatures for the function'),
}).describe('Object keyed by each exported TypeScript function name to array of all the function signatures').strict();
const FunctionSignaturesSchemaObj = z.object({
    functions: z.record(z.string().describe("The name of the exported function"), // Key: Function name
    z.array(z.string().describe("The TypeScript signature of the function")).describe("An array of TypeScript function signatures for the function")).describe("A mapping of exported function names to their TypeScript signatures"),
})
    .describe("Object keyed by each exported TypeScript function name to array of all the function signatures")
    .strict();
const funcsStruct = {
    name: 'FunctionSignatures',
    definition: 'A mapping of exported function names to their TypeScript signatures',
    schema: FunctionSignaturesSchemaObj,
};
const FunctionSignaturesSchema = z.record(z.string().describe("The name of the exported function"), // Key: Function name
z.array(z.string().describe("The TypeScript signature of the function")).describe("An array of TypeScript function signatures for the function")).describe("A mapping of exported function names to their TypeScript signatures");
//export const 
// PK-Lib imports
import { dbgWrt, } from 'pk-ts-sqlite-lib';
//Local Imports
import { getPkClient, askLlmProvider, } from './init.js';
let funcsCmd = new Command('funcs')
    .description("Test 'generateObject for common func names")
    .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
    .action(async (filter, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    try {
        //let obj = await client.sdkObject('get-funcs', FuncSigSchema, modelName);
        //let obj = await client.sdkObject('get-funcs', FunctionSignaturesSchemaObj, modelName);
        let obj = await client.sdkObject(funcsStruct, 'get-funcs', modelName);
        let opath = dbgWrt(obj, 'funcsObj');
        console.log(`Wrote funcs obj to: [${opath}]`);
    }
    catch (e) {
        let errPath = dbgWrt(e, 'ErrOut');
        console.error(`Caught error:`, e, `wrote to [${errPath}]`);
    }
});
let program = new Command()
    .name('Execute LLM Commands')
    .option('-p, --provider <name>', 'The Provider name', '');
let modelsCmd = new Command('models')
    .description("List models for provider")
    .argument('[filter]', 'Filter Models by', '')
    .action(async (filter, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    //let models = await client.getModels();
    //let models = await client.filterModels({type:'chat'});
    let models = await client.filterModels(filter);
    dbgWrt(models, `${provider}-models`);
    let names = client.modelObjsToNames(models);
    let cnt = models.length;
    //    let connection = new AiSdk(provider);
    //    let models = await connection.getModels();
    console.log("In ModelsCmd", { filter, options, opts, models, names, cnt, });
});
let modelNameCmd = new Command('modelName')
    .description("List models for provider")
    .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
    .action(async (filter, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    console.log({ modelName });
});
let askChatCmd = new Command('asksdkchat')
    .description("Arg is sysMsgKey - prompt for uMsg Chat with AI")
    .argument('[msg]', 'Initial Usr Msg', '')
    .action(async (msg, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    //let chatRes = await client.sdkChat({user});
    let chatRes = await client.sdkChat(msg, true);
    dbgWrt(chatRes);
    console.log({ chatRes });
});
let chatCmd = new Command('sdkchat')
    .description("Chat with AI")
    .argument('[user]', 'Initial Usr Msg', '')
    .action(async (user, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    //let chatRes = await client.sdkChat({user});
    let chatRes = await client.sdkChat(user);
    dbgWrt(chatRes);
    console.log({ chatRes });
});
program.addCommand(askChatCmd);
program.addCommand(modelsCmd);
program.addCommand(modelNameCmd);
program.addCommand(chatCmd);
program.addCommand(funcsCmd);
await program.parseAsync(process.argv);
//# sourceMappingURL=cmdr.js.map