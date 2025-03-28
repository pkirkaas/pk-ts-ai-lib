/**
 * Use Commander for CLI script
 */

// NPM Imports
import { Command } from 'commander';
import type { Command as CommandType } from 'commander';
import { z } from 'zod';


// PK-Lib imports
import {
  dbgWrt,
} from 'pk-ts-sqlite-lib';

//Local Imports

import {
  providers, OpenAiClient, getPkClient, askLlmProvider, FunctionNamesSchema,
  StructureSpec, getLlmProvider,
} from './init.js';


// Exports & implementations

let program = new Command()
  .name('Execute LLM Commands')
  .option('-p, --provider [name]', 'The Provider name', 'openrouter')
  .option('-m, --mnfilters <names...>', 'Model Name Filters', '')
  ;
let opts = program.opts();

/**
 * Any runtime opts mods - CALL IN EACH COMMAND ACTION
 */
async function setOpts() {
  if (opts.provider === true) {
    opts.provider = await askLlmProvider();
  }
  return opts;
}

program.addCommand(new Command('tstopts')
  .description("Test variadic options")
  .option('--filters <name...>', 'Model filter string(s)', '')
  .action(async (options) => {
    await setOpts();
    console.log({ options, opts, });
  }));


program.addCommand(new Command('models')
  .description("List models for provider")
  //.argument('[filter...]', 'Filter Models by', '')
  //.action(async (filter, options) => {
  .action(async (options) => {
    await setOpts();
    let { provider, mnfilters } = opts;
    provider = getLlmProvider(provider);
    let client = getPkClient(provider);
    let models = await client.filterModels({ mnfilters });
    dbgWrt(models, `${provider}-models`);
    let names = client.modelObjsToNames(models);
    let cnt = models.length;
    console.log("In ModelsCmd", { mnfilters, options, opts, models, names, cnt, provider, });
  })
);

program.addCommand(new Command('modelName')
  .description("List models for provider")
  .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
  .action(async (filter, options) => {
    await setOpts();
    let { provider, mnfilters } = opts;
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    console.log({ modelName });
  }));

program.addCommand(new Command('nchat')
  .description("Chat with Native SDK")
  .argument('[msg]', 'Initial Usr Msg', '')
  .action(async (msg, options) => {
    await setOpts();
    let { provider, mnfilters } = opts;
    let client = getPkClient(provider);
    let chatRes = await client.nativeChat(msg);
    dbgWrt(chatRes);
    console.log({ chatRes });
  })
);


program.addCommand(new Command('imgGen')
  .description("Generate an image")
  .argument('[msg]', 'Initial Usr Msg', '')
  .action(async (msgs, options) => {
    await setOpts();
    let { provider, mnfilters } = opts;
    provider = getLlmProvider(provider);
    let client = getPkClient(provider);
    let imgRes = await client.imgGen({ msgs, mnfilters });
    console.log({ imgRes });
  })
);

program.addCommand(new Command('sdkchat')
  .description("Chat with AI SDK")
  .argument('[msgs...]', 'Initial Usr Msg', '')
  .action(async (msgs, options) => {
    await setOpts();
    let { provider, mnfilters } = opts;
    provider = getLlmProvider(provider);
    let client = getPkClient(provider);
    let chatRes = await client.sdkChat({ msgs, mnfilters });
    dbgWrt(chatRes);
    console.log({ chatRes });
  })
);

// End Commands; Start Parse

try {
  await program.parseAsync(process.argv);
} catch (e) {
  console.error(`Error in cmdr - `, e);
}

/*



export const StringArraySchema = z.string().array();
export const FuncSigSchema = z.object({
  functionName: z.string().describe('Exported function name'),
  functionSignatures: z.string().array().describe('Array of all signatures for the function'),
}).describe('Object keyed by each exported TypeScript function name to array of all the function signatures').strict();

const FunctionSignaturesSchemaObj = z.object({
  functions: z.record(
    z.string().describe("The name of the exported function"), // Key: Function name
    z.array(
      z.string().describe("The TypeScript signature of the function")
    ).describe("An array of TypeScript function signatures for the function")
  ).describe("A mapping of exported function names to their TypeScript signatures"),
})
  .describe("Object keyed by each exported TypeScript function name to array of all the function signatures")
  .strict();

const funcsStruct: StructureSpec = {
  name: 'FunctionSignatures',
  definition: 'A mapping of exported function names to their TypeScript signatures',
  schema: FunctionSignaturesSchemaObj,
};




const FunctionSignaturesSchema = z.record(
  z.string().describe("The name of the exported function"), // Key: Function name
  z.array(
    z.string().describe("The TypeScript signature of the function")
  ).describe("An array of TypeScript function signatures for the function")
).describe("A mapping of exported function names to their TypeScript signatures")
  ;

program.addCommand(new Command('funcs')
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
    } catch (e) {
      let errPath = dbgWrt(e, 'ErrOut');
      console.error(`Caught error:`, e, `wrote to [${errPath}]`);
    }
  }));


program.addCommand(new Command('asksdkchat')
  .description("Arg is sysMsgKey - prompt for uMsg Chat with AI")
  .argument('[msg]', 'Initial Usr Msg', '')
  .action(async (msg, options) => {
    let opts = program.opts();
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    let chatRes = await client.sdkChat(msg, true);
    dbgWrt(chatRes);
    console.log({ chatRes });
  })
);


program.addCommand(new Command('decomp')
  .description("Test 'generateObject for common func names")
  .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
  .action(async (filter, options) => {
    await setOpts();
    let {provider,} = opts;
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    try {
      //let obj = await client.sdkObject('get-funcs', FuncSigSchema, modelName);
      //let obj = await client.sdkObject('get-funcs', FunctionSignaturesSchemaObj, modelName);
      let obj = await client.sdkTsDecomp();
      let opath = dbgWrt(obj, `sdkDecomp-${provider}`);
      console.log(`Wrote funcs obj to: [${opath}]`);
    } catch (e) {
      let errPath = dbgWrt(e, 'ErrOut');
      console.error(`Caught error:`, e, `wrote to [${errPath}]`);
    }

  }));




*/