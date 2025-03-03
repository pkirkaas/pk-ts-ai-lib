{| Train on code libraries |}
[[aicodetrainbase]] [[node]]

I have developed several multi-turn CLI/Terminal-based AI Chat applications in NodeJS/TypeScript, using several NPM AI Client Libraries, including OpenAI, Anthropic, Vercel AI SDK, etc.

I use several pretrained LLMs including OpenAI "chat GPT 3.5", Anthropic "Claude 3.7 Sonnet", as well as small open source LLMs running on my local development machine through LMStudio and ollama.

These work fine, but they are pretrained general purpose LLMs. I want to develop a chat application that specializes in Software Coding assistance, specializing in JavaScript/TypeScript code.

The key requirement for my application is to be able to give the application/LLM specialized training on specific TypeScript/NPM library packages, and have it retain/persist the specialized knowledge of that library for use when developing other applications that use the library packages.

General LLMs are trained on huge amounts of code and usually have a training cut-off date 6 months or a year in the past. Cutting edge Software Libraries often change week by week, so the training data is often out of date.

My goal is to develop an application that can accept a local file directory path or GitHub URL for a TypeScript/JavaScript source code library.

The application should be able to traverse these source repositories without supervision, deeply understand the usage of the library repository, and retain that understanding to be able to act as a coding assistant specialized in that library package.

I understand this is a long term, multi-stage process, and different tools, techniques & LLMs might be used in the training process versus the LLM that uses the training to act as a code assistant.

For now, bearing in mind the long term, abstract goals described, I would like you to creatively think of various approaches I could use to achieve my goals.

Please provide enough details, pros and cons, etc, to allow me to evaluate and investigate which approaches to examine in further detail.

{|
Using GPT to analyze code and providing a schema:
- It appears primarily suitable for functions. TS/JS Classes should also have information about ancestor classes, member properties, member methods, inherited versus local properties, whether the properties are static/class properties, or instance properties, etc.

- Even just for functions, the schema is inadequate. Functions are often overloaded, with multiple signatures for each overloaded function with different parameter count, names, types, optional and required parameters, default values, etc.

- Similarly, a function can have multiple possible return types, and the analysis/description of the function return values should include not just type, but also a semantic description/definition of what the return value represents/is used for.

These concerns lead to 3 questions:

- Is it realistic to expect GPT-4 to generate a much more complicated JSON Schema, with more layers, details, arrays of signatures, etc?

- Is it advisable to have a single schema used for all types of exports - `functions`, `classes`, `interfaces`, etc., or should each type of analyzed export have a different, specialize schema?

- Would it be advisable/useful to use a more formal process to define the JSON schemas, like the `zod` NPM type library?
|}