/**
 * Use Commander for CLI script
 */

// NPM Imports
import { Command } from 'commander';
import type { Command as CommandType } from 'commander';



// PK-Lib imports

//Local Imports

import {
  providers, AiSdk, OpenAiClient, getPkClient,
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
    let client = getPkClient(provider);
    //let models = await client.getModels();
    //let models = await client.filterModels({type:'chat'});
    let models = await client.filterModels();
    let cnt = models.length;
//    let connection = new AiSdk(provider);
//    let models = await connection.getModels();
    console.log("In ModelsCmd", {filter, options, opts,  models, cnt,});
  });

  program.addCommand(modelsCmd);




  await program.parseAsync(process.argv);