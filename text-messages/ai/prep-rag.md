{|Stepwise - figure out finally how to prepare RAG training data for a TypeScript codebase.

First, please explain in detail the possible approaches to custom train an LLM on a custom code base - RAG, `fine tuning`, etc.

Let's focus on very detailed specifics of implementing RAG training for TypeScript functions.

Explain the best way to chunk and generate embeddings for code. Should it really be just by text chunks from the source code file, or would it be more useful to somehow break down the source code to include information about function signature, name, parameters, return, etc?

There are multiple approaches to custom training LLMs specifically for Software Code, including RAG and Fine-Tuning.

Within each approach, there are multiple sub-approaches. For example, with RAG training, there are libraries like `langchain`, `langgraph`, etc.

At this point, please provide a very detailed overview of various approaches to the data preparation and training, with trade-offs and pros and cons of each.

|}

[[aicodetrainbase]]

Let's focus on very detailed specifics of implementing hybrid RAG training for TypeScript source code, using code language specific AST based code parsing.

The implementation of the code-trainer will also be written in TypeScript, on NodeJS v >=20.

We will base the training application on the `llamaindex` npm library, and associated supporting packages.

We can use the npm package `ts-morph` to build the AST, or utilities provided by `llamaindex` - recommend an approach to the AST parsing.

We have the `chromadb` vector DB installed, but let me know if you have a better recommendation.

Recall the source code must be parsed and prepared and chunked purely by the AI, from a single base source directory - no developer will prepare the code.

We have access to multiple LLMs and multiple AI API endpoints/providers, so it is totally okay to implement in multiple stages with different AIs/LLMs for different phases.

