[[aiclient]]


You are an expert in the new Anthropic/Claude `Claude 3.7 Sonnet` LLM family and new deep thinking APIs as documented in `https://docs.anthropic.com/en/docs/about-claude/models/extended-thinking-models`

{|

You are an expert with the latest versions (4.1)  of the NPM AI SDK client libraries by `Vercel` - https://sdk.vercel.ai/ -

Particularly the `generateText` functions for chat completions.

|}

I have a working multi-turn AI chat application written in NodeJS/TypeScript, using the AISDK `generateText` function with the `claude-3.5-sonnet` model & Anthropic endpoint.

But now I want to use the longer thinking mode with expanded token length & reasoning tokens with `Claude 3.7 Sonnet`.

I have successfully upgraded the model in my chat application to use  `Claude 3.7 Sonnet`, and the chat works with the new Claude 3.7 model, but not with the enhanced thinking mode and the responses end before completion (at about 8000 tokens), with the stop reason 'token length exceeded'. I am not sure I calling the the new Claude NPM API Client correctly to use the new 'thinking' mode. I am following the example as follows:

```js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 128000,
  thinking: {
    type: "enabled",
    budget_tokens: 32000
  },
  messages: [{
    role: "user",
    content: "Provide full documentation of the new Claude 3.7 thinking API"
  }],
  betas: ["output-128k-2025-02-19"]
});
```

The documentation for the new beta messages API is incomplete. The documentation does not list all possible parameters to the `messages.create` function (like temperature, system message, etc), and does not fully document the `response` format - for example, how to extract the assistant message from the response (is it `response.content`, or `response.content.text`, or what?

Also, how can I find the tokens used, stop reason, and other information from the response?





