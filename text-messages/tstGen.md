The long-term goal for this project is RAG train a general purpose LLM on a TypeScript code library of reusable functions. The result of this RAG training is a customized LLM that is trained on the codebase and can answer questions about the codebase, suggest code completions, and highlight code errors - everything an AI coding assistant should do, but enhanced with the specialized training on the custom libraries.

The functions are often complex, with with multiple parameters. The parameters often allow multiple types (for example, `string` or `string[]`), with different behaviors and returns depending on the parameter types and values.

The returns can also be of multiple types, depending on the types and values of the parameters.

The first step is to capture all the relevant information about the functions in the codebase. This includes the function name, the parameters, the return type, and the documentation.

Below follows the TypeScript source code containing multiple function definitions/exports. First, you should deeply analyze & understand all the exports, functions, definitions, and their relationships.

After that, there is a json schema that specifies exactly what information/analysis to return for each function, to be used in RAG training.
