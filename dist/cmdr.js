/**
 * Use Commander for CLI script
 */
// NPM Imports
import { Command } from 'commander';
// PK-Lib imports
//Local Imports
import { getPkClient, } from './init.js';
let program = new Command()
    .name('Execute LLM Commands')
    .option('-p, --provider <name>', 'The Provider name', 'openai');
let modelsCmd = new Command('models')
    .description("List models for provider")
    .argument('[filter]', 'Filter Models by', '')
    .action(async (filter, options) => {
    let opts = program.opts();
    let { provider } = opts;
    let client = getPkClient(provider);
    //let models = await client.getModels();
    //let models = await client.filterModels({type:'chat'});
    let models = await client.filterModels();
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
    let { provider } = opts;
    let client = getPkClient(provider);
    let modelName = await client.getModelName(filter);
    console.log({ modelName });
});
program.addCommand(modelsCmd);
program.addCommand(modelNameCmd);
await program.parseAsync(process.argv);
//# sourceMappingURL=cmdr.js.map