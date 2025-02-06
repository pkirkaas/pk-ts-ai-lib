You have expertise in developing custom Chat programs using the Anthropic Messaging API and the npm/node package Anthropic from `@anthropic-ai/sdk`.

I have a basic chat application with Claude written in TypeScript and it works. I would like to enhance it, and I want some help with the following questions:

The example basic chat from the Anthropic documentation is:

```js
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

await anthropic.messages.create({
  model: "claude-3-5-sonnet-20240620",
  max_tokens: 1024,
  messages: [
    {"role": "user", "content": "Hello, world"}
  ]
});
```

The `messages` parameter can only accept roles of `user` and `assistant`. To provide a `system` information to the chat request, this is a separate parameter called `system` with a text body. I do have special system instructions, but is there any advantage or reason to provide that system instruction in the `system` field, or could it just as well be included in the `user` `content` body?

Also, the illustrative code above is for a single message and response. How do I modify it to allow interactive, followup questions within the chat, maintaining context?