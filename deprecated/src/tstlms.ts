/**
 * Testing LM Studio & the 
 */

import { LMStudioClient } from "@lmstudio/sdk";
import OpenAI from 'openai';



import {
  runCli, dbgWrt, stdOut, envInit,
} from 'pk-ts-node-lib';

envInit();



//console.log('env',process.env);
const LMS_PORT = process.env.LMS_PORT;
//http://192.168.1.80:5324

//let baseURL = `http://localhost:${LMS_PORT}/v1`;
let baseURL = `http://192.168.1.80:${LMS_PORT}/v1`;
let lmsBaseUrl =  `ws://127.0.0.1:${LMS_PORT}`;
console.log({baseURL, lmsBaseUrl});
let oaiClient = new OpenAI({baseURL});
//let models = await client.
let oaiModelObjs= (await oaiClient.models.list()).data;

let lmsClient = new LMStudioClient({baseUrl:lmsBaseUrl});
let lmsModelObjs = await lmsClient.llm.listLoaded();
console.log({oaiModelObjs, lmsModelObjs});
/*





const client = new LMStudioClient();

async function main() {
  const modelPath = "lmstudio-community/Meta-Llama-3-8B-Instruct-GGUF";
  const llama3 = await client.llm.load(modelPath, { config: { gpuOffload: "max" } });
  const prediction = llama3.respond([
    { role: "system", content: "Always answer in rhymes." },
    { role: "user", content: "Please introduce yourself." },
  ]);

  for await (const { content } of prediction) {
    process.stdout.write(content);
  }

  const { stats } = await prediction;
  console.log(stats);
}

main();
*/