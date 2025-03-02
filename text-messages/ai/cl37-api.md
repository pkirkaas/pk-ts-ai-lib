[[claude]] [[node]]

I have developed a basic but working multi-turn AI chat application written in NodeJS/TypeScript, with the Anthropic Node Client and `claude-3.5-sonnet` model.

Now I am migrating to and experimenting with using latest the `Claude 3.7 Sonnet` model and the Anthropic NPM beta SDK client and beta `client.beta.messages.create()` messaging method.

I would like some guidance/advice on details of how to best use the new implementation.

- What is the advantage/purpose of using the `metadata` parameter in the `client.beta.messages.create` method in a muti-turn/multi-round chat conversation?

What should the `metadata` parameter contain? Are there other metadata keys that would be useful?

It appears that many of the metadata keys/examples you provide are mostly useful information for the developer of the chat application, like performance tracking.

What if any metadata fields are used by the Anthropic API to influence its response?

Like the feature flags? Is that correct? Anything else?

{|
```ts
  metadata: {
    conversation_id: this.conversationId,
    user_id: "user-123",
  }
```
- Streaming response: I am aware of the `stream` option, which provides more immediate feedback/response to the user. I don't care about that at all, so I don't use streaming. But sometimes the response from claude is cut off because of length. Would using streaming increase the possible output length of the response? Are there other advantages to streaming aside from user experience?
- Multi-turn chat & caching:  The non-beta version of the NPM client (`client.messages.create`) allowed the developer to specify the `cache_control: { type: "ephemeral" }` key/value to the system message to enable caching and reduce processing time/cost for multi-turn chat conversations. Is it still required to specify the `cache_control` block in the new  `client.beta.messages.create()` messaging method to make use of caching?




[[ai]] [[node]]

You are an expert in the new Anthropic/Claude `Claude 3.7 Sonnet` LLM family and new deep thinking APIs as documented in `https://docs.anthropic.com/en/docs/about-claude/models/extended-thinking-models`


[[aiclient]]

You are an expert with the latest versions (4.1)  of the NPM AI SDK client libraries by `Vercel` - https://sdk.vercel.ai/ -

Particularly the `generateText` functions for chat completions.

|}

{|
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

|}





