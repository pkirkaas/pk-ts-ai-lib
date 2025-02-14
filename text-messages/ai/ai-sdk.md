[[aiclient]]

You are an expert with the latest versions (4.1)  of the NPM AI SDK client libraries by `Vercel` - https://sdk.vercel.ai/ -

Particularly the `generateText` function for chat completions.

I want you to create an asynchronous multi-turn interactive chat function (Call it `multiChat`) in a NodeJS CLI/Terminal application, using the `generateText` function written, in TypeScript.

The function should assume the openai client imported from "@ai-sdk/openai".

The function should accept the following parameters (all optional, with reasonable defaults):

- uMsg:string - the initial user/chat message
- sMsg:string - the system message for the chat
- model:string - the OpenAI model name
- chatParams:object - settings for the chat, like `temperature`, context length, top-k, etc.
- Any other parameters you think would be useful

It should maintain context during the conversation, but repeat as little as possible for each round to reduce total use of tokens.

- The function should retain the entire context of the conversation for the entire duration.

- The function should not truncate any parts of the conversation - it should allow the api to handle overflow errors

- The function should terminate when the user inputs 'exit' or 'quit' as the user message.

- You can determine the default values for all parameters - I will change them manually.

- The error handling should just throw a detailed exception describing the error and all details

- The output format should be text-based Markdown format

- The conversation/history can be maintained in memory, persistence between sessions is not required.

- The chat parameters should accept all OpenAI API parameters

- The markdown format should include timestamps and codeblocks and other enhanced markdown syntax

- The input does not need to support multi-line or any other commands

- It is not necessary to provide context history or clear context within a conversation

- The error handling does not need to recover or retry - any errors should throw a very detailed exception with all relevant context and reasons for the errors

Please generate this function, with error handling and handling of edge cases - but ask all clarifying questions you need before providing code.
