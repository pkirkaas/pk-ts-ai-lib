[[code]] [[ai]]

You will provide a detailed explanation and full TypeScript code implementation to train a LLM on a custom codebase of TypeScript library functions - by RAG or Fine-Tuning or other training methods.

The trained LLM should be able to answer questions about the codebase, and understand the purpose of the functions, the parameters, and the return values, and be able to generate new code based on the context of the codebase.

The codebase is a TypeScript library with multiple functions which do not have good documentation or explanatory comments. 

The application you generate should NOT require human/manual intervention to prepare the codebase or train the LLM, the application should be able to train itself on the codebase.

Note I already have implemented a working ChatBot in TypeScript using the `OpenAI API` and multiple LLM models. The application you generate should run on a local development machine, but can make use of API calls to cloud-based LLM services.

Your solution should specify all suggested libraries and external tools (Vector Databases, Embeddings, etc.) and explain how they are used.

Rather than pinecone, consider pros/cons of `ChromaDB`, `postgres` with vector extensions, etc. The store should support both vector searching and text searching.

Carefully consider your proposed embedding model, and explain your choice.

Ideally, the resultant RAG training data in the vector store should be applicable to multiple different LLM models - not just one. For simplicity, you can assume any LLM model used will support the `OpenAI API` and the `OpenAI Embeddings API`.

The codebase of the TypeScript library is 120 KB in size, consisting of 5 source files, mostly TypeScript functions, but some JavaScript/TypeScript classes, and some TypeScript type/interface exports. There are a few hundred exports.

The `package.json` and other configuration files should ideally be included in the analysis to give better perspective of the dependencies, but only if that does not significantly increase the complexity of the implementation/approach.

The embeddings should track/reflect the library module - ultimately, this solution will be used to train LLMs on several, related TS code libraries.

The library code will evolve over time, so this implementation should allow for the training data to be updated when the code changes.

