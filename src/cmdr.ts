/**
 * Use Commander for CLI script
 */

// NPM Imports
import { Command } from 'commander';
import type { Command as CommandType } from 'commander';



// PK-Lib imports

//Local Imports

import {
  providers, AiSdk, OpenAiClient, getClient,
} from './init.js';

let program = new Command()
  .name('Execute LLM Commands')
  .option('-p, --provider <name>', 'The Provider name', 'openai')
;

let modelsCmd = new Command('models')
  .description("List models for provider")
  .argument('[filter]','Filter Models by','')
  .action( async(filter, options) => {
    let opts = program.opts();
    let {provider} = opts;
    let client = getClient(provider);
    //let models = await client.getModels();
    let models = await client.filterModels();
//    let connection = new AiSdk(provider);
//    let models = await connection.getModels();
    console.log("In ModelsCmd", {filter, options, opts,  models,});
  });

  program.addCommand(modelsCmd);









































  await program.parseAsync(process.argv);