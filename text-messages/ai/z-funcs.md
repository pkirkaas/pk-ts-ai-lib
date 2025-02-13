{|
Structured outputs for OpenAI
Step 1 - get OAI to generate Zod schema & openai client call 
|}
[[aiclient]] [[zod]]

You are an expert in the latest TypeScript development, and have expertise with the npm `Zod` schema library, and the latest OpenAI API node library, particularly the new Structured Object return type using Zod to specify the return object schema.

I want to use the OpenAI npm client to parse a TypeScript file that exports many typescript functions. I want to submit the TypeScript source code as part of the request to the OpenAI API, and I want OpenAI to return a structured JSON object that is keyed by each exported function name. The value of each function name key should be a string array of all TypeScript function signatures for that function name.

Please provide an appropriate Zod schema for this, as well as the OpenAI node client call to implement this, using `openai.beta.chat.completions.parse` with Structured Object return.