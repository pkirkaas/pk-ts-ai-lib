{|Stepwise - figure out finally how to prepare RAG training data for a TypeScript codebase.

First, please explain in detail the possible approaches to custom train an LLM on a custom code base - RAG, `fine tuning`, etc.

|}

[[aicodetrainbase]]

Let's focus on very detailed specifics of implementing RAG training for TypeScript functions.

Explain the best way to chunk and generate embeddings for code. Should it really be just by text chunks from the source code file, or would it be more useful to somehow break down the source code to include information about function signature, name, parameters, return, etc?
