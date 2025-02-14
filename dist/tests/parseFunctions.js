/**
 * Testing a direct OpenAI call to parse functions - as suggested by OpenAI
 */
import { z } from "zod";
//import { Configuration, OpenAIApi } from "openai";
//import { Configuration, OpenAIApi } from "openai";
import OpenAI from "openai";
// Enhanced Zod schema for structured outputs
const FunctionSignaturesSchema = z.object({
    functions: z.record(z.string().describe("The name of the exported function"), // Key: Function name
    z.array(z.string().describe("The TypeScript signature of the function")).describe("An array of TypeScript function signatures for the function")).describe("A mapping of exported function names to their TypeScript signatures"),
});
// Initialize OpenAI API client
/*
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is set in the environment
});
*/
//const openai = new OpenAIApi(configuration);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
/**
 * Reads a TypeScript file and submits it to OpenAI for parsing.
 * @param filePath - Path to the TypeScript file to parse.
 */
/*
async function parseTypeScriptFile(filePath: string) {
try {
// Read the TypeScript file
const tsSourceCode = await fs.readFile(filePath, "utf-8");

// Define the system and user messages for the OpenAI API
const messages:ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a TypeScript code analyzer. Extract all exported function names and their TypeScript signatures.",
  },
  {
    role: "user",
    content: `Here is the TypeScript source code:\n\n${tsSourceCode}`,
  },
];

// Call the OpenAI API with structured outputs
const response = await openai.chat.completions.create({
  model: "gpt-4o-2024-11-20", // Use the latest GPT model with structured outputs
  messages,
  functions: [
    {
      name: "extract_function_signatures",
      description: "Extracts exported function names and their TypeScript signatures.",
      parameters: FunctionSignaturesSchema, // Use the enhanced Zod schema
    },
  ],
  function_call: { name: "extract_function_signatures" }, // Explicitly request the function call
});

// Parse and validate the response using the Zod schema
const parsedResponse = FunctionSignaturesSchema.parse(
  response.data.choices[0].message?.function_call?.arguments
);

console.log("Parsed Function Signatures:", parsedResponse);
return parsedResponse;
} catch (error) {
// Enhanced error handling
if (error instanceof z.ZodError) {
  console.error("Schema validation error:", error.errors);
} else if (error.response) {
  console.error("OpenAI API error:", error.response.data);
} else {
  console.error("Unexpected error:", error);
}
throw error;
}
}

// Example usage
(async () => {
const filePath = path.resolve(__dirname, "example.ts");
try {
const result = await parseTypeScriptFile(filePath);
console.log("Final Result:", result);
} catch (error) {
console.error("Failed to parse TypeScript file:", error);
}
})();

*/ 
//# sourceMappingURL=parseFunctions.js.map