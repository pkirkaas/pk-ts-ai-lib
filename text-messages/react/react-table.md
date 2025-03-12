[[reactcss]]

I want to create a reusable react table component. I don't want to develop the component from scratch - there are multiple excellent react table component libraries/modules. I want to extend an existing npm table component package, with minimal development effort or complexity to meet my requirements. I am not particularly concerned with the appearance of it - this is purely for internal development purposes. The table component should have these features:

- It will accept an array of JavaScript objects.
- The keys of the objects will be the column headers of the table
- The keys of the JS objects are not known beforehand, but all objects array will have the same keys, so the component should use the keys of the objects as table headers.
- Some of the object values will also be small JS objects or arrays. The table elements should be able to display JS objects and arrays as well as primitive values like strings and numbers.
- The table component should allow resizing of the columns
- The table component should allow the user to show/hide named columns
- The table component should allow sorting by values for each column
- The table component should allow filtering of rows based on values in each column - for string values, by substring, for numeric values, by equality, greater, or less than.

We will use the Material React Table Component (https://www.npmjs.com/package/material-react-table)

Which is built on the Tanstack React Table component (https://www.npmjs.com/package/@tanstack/react-table)

And uses @mui components - @mui/material @mui/x-date-pickers @mui/icons-material @emotion/react @emotion/styled

Generate the code for a react table component as described above, using the components identified.

Ensure simplicity of implementation, robustness, error handling, and completeness. Double check your response.


Example data for table component.
```js
[
  {
    id: 'openai/gpt-3.5-turbo',
    name: 'OpenAI: GPT-3.5 Turbo',
    created: 1685232000,
    description: "GPT-3.5 Turbo is OpenAI's fastest model. It can understand and generate natural language or code, and is optimized for chat and traditional completion tasks.\n\nTraining data up to Sep 2021.",
    context_length: 16385,
    architecture: {
      modality: 'text->text',
      tokenizer: 'GPT',
      instruct_type: null,
    },
    pricing: {
      prompt: '0.0000005',
      completion: '0.0000015',
      image: '0',
      request: '0',
      input_cache_read: '0',
      input_cache_write: '0',
      web_search: '0',
      internal_reasoning: '0',
    },
    top_provider: {
      context_length: 16385,
      max_completion_tokens: 4096,
      is_moderated: true,
    },
    per_request_limits: null,
    createdAt: '28-May-23',
  },
  {
    id: 'openai/gpt-3.5-turbo-0125',
    name: 'OpenAI: GPT-3.5 Turbo 16k',
    created: 1685232000,
    description: 'The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Training data: up to Sep 2021.\n\nThis version has a higher accuracy at responding in requested formats and a fix for a bug which caused a text encoding issue for non-English language function calls.',
    context_length: 16385,
    architecture: {
      modality: 'text->text',
      tokenizer: 'GPT',
      instruct_type: null,
    },
    pricing: {
      prompt: '0.0000005',
      completion: '0.0000015',
      image: '0',
      request: '0',
      input_cache_read: '0',
      input_cache_write: '0',
      web_search: '0',
      internal_reasoning: '0',
    },
    top_provider: {
      context_length: 16385,
      max_completion_tokens: 4096,
      is_moderated: true,
    },
    per_request_limits: null,
    createdAt: '28-May-23',
  },
  {
    id: 'openai/gpt-4',
    name: 'OpenAI: GPT-4',
    created: 1685232000,
    description: "OpenAI's flagship model, GPT-4 is a large-scale multimodal language model capable of solving difficult problems with greater accuracy than previous models due to its broader general knowledge and advanced reasoning capabilities. Training data: up to Sep 2021.",
    context_length: 8191,
    architecture: {
      modality: 'text->text',
      tokenizer: 'GPT',
      instruct_type: null,
    },
    pricing: {
      prompt: '0.00003',
      completion: '0.00006',
      image: '0',
      request: '0',
      input_cache_read: '0',
      input_cache_write: '0',
      web_search: '0',
      internal_reasoning: '0',
    },
    top_provider: {
      context_length: 8191,
      max_completion_tokens: 4096,
      is_moderated: true,
    },
    per_request_limits: null,
    createdAt: '28-May-23',
  },
  //etc
]
```