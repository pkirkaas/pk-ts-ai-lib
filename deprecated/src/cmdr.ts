/**
 * Use Commander for CLI script
 */

// NPM Imports
import { Command } from 'commander';
import type { Command as CommandType } from 'commander';



// PK-Lib imports
import {dbgWrt,
} from 'pk-ts-sqlite-lib';

//Local Imports

import {
  providers, AiSdk, OpenAiClient, getPkClient, askLlmProvider,
} from './init.js';

let program = new Command()
  .name('Execute LLM Commands')
  .option('-p, --provider <name>', 'The Provider name', '')
;

let modelsCmd = new Command('models')
  .description("List models for provider")
  .argument('[filter]','Filter Models by','')
  .action( async(filter, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    //let models = await client.getModels();
    //let models = await client.filterModels({type:'chat'});
    let models = await client.filterModels();
    dbgWrt(models,`${provider}-models`);
    let names = client.modelObjsToNames(models);
    let cnt = models.length;
//    let connection = new AiSdk(provider);
//    let models = await connection.getModels();
    console.log("In ModelsCmd", {filter, options, opts,  models, names, cnt,});
  });

let modelNameCmd = new Command('modelName')
  .description("List models for provider")
  .argument('[filter]','Filter Models by "all", "default", "current", or a substring','')
  .action( async(filter, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    console.log({modelName});
  });

let chatCmd = new Command('sdkchat')
  .description("Chat with AI")
  .argument('[user]','Initial Usr Msg','')
  .action( async(user, options) => {
    let opts = program.opts();
    //let {provider} = opts;
    let provider = opts.provider || await askLlmProvider();
    let client = getPkClient(provider);
    //let chatRes = await client.sdkChat({user});
    let chatRes = await client.sdkChat(user);
    dbgWrt(chatRes);
    console.log({chatRes});
  });

  program.addCommand(modelsCmd);
  program.addCommand(modelNameCmd);
  program.addCommand(chatCmd);




  await program.parseAsync(process.argv);