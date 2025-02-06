/** Sigh. HF has it's own API & JS Client - not OpenAI's. */

export const hfModels = {
  gemma22b: "google/gemma-2-2b-it",
  llama318b: "meta-llama/Meta-Llama-3.1-8B-Instruct",
  qwen2_5_72b:"Qwen/Qwen2.5-72B-Instruct",
  llama3170b:"meta-llama/Meta-Llama-3.1-70B-Instruct",
  phi3mini4k: "microsoft/Phi-3-mini-4k-instruct",
};

import { PkError } from "pk-ts-common-lib";

import { HfInference } from "@huggingface/inference";

export const hf = new HfInference(process.env.HF_API_KEY);
export let defaultContent = "Which is larger, Germany or France?";
export let defaultSystem = "You are a helpful assistant.";

export async function hfChat(content=defaultContent, model=null) {
  let models = Object.values(hfModels);
  if (!model) {
    model = models[0]; // Default to first model
  }
  if (model in hfModels) {
    model = hfModels[model];
  }
  if (!models.includes(model)) {
    throw new PkError(`Model ${model} not in hfModels:`, { models });
  }
  console.log(`hfChat: model=${model}`);
  let messages = [
   // {role:"system", content: defaultSystem},
    {role:"user", content},
  ];
  let ans = await hf.chatCompletion({
    model,
    messages,
  });
  console.log(`hfChat: ans:`,{ans});
  return ans;
}

