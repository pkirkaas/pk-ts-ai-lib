{|Query TS implementation w. ChromaDB |}
[[ragnovel]]

I am implementing my test rag training project for novels in TypeScript, using ChromaDB.

I have the project skeleton up and running. I have a local ChromaDB running, and I can connect to it and create collections.

I also have a datasource of the first novel in Markdown text format, `LifeInVenice.md`.

I will use the `DefaultEmbeddingFunction` from ChromaDB.

I need to chunk the text of the novel, with appropriate overlap of lines in the chunks.

I want to use either `llamaindex` or `langchain` to perform the chunking. I can install whatever appropriate additional npm libraries/packages as required.

Please evaluate pros/cons/considerations of using llamaindex, langchain, or other tools to implement the chunking, make a recommendation, and provide code to implement the chunking.