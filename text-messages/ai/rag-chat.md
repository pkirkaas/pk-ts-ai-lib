{| Chat about RAG concepts |}
[[rag]]

I want to experiment with implementing an LLM RAG training application written in Python or TypeScript, with standard tools, vector DB, etc.

I am familiar with various vector DBs, implementing AI chat applications with calls to LLM APIs, etc.

However, in this chat I want to develop my conceptual understanding of how to implement RAG - not specific tools, languages, or code.

Suppose I want to develop a RAG training to answer questions about specific books/novels.

I will start with a single novel for the training, but I will want to add additional novels as we go along.

So, I understand the data (text of the novel) needs to be prepared and chunked.

But the RAG training for that novel should also include "metadata" about the novel - at least, `title`, `author`, `genre`, etc.

The RAG training should support both identifying novel by content questions, like:

- Which novel has the character `Daryl Saroyan`?
- Which novel involves international espionage with making a movie in Hollywood? 

But should also support answering questions about content, based on the novel, like:

- In what time period is the novel  `The Sun Also Rises` set?
- Who are the main protagonists in the novel `Smileys People`?

I would choose the approach of "Linked Metadata"
- Store chunks and metadata separately with reference IDs
- Join metadata during retrieval or response generation

So how would I go about that? 

Ask clarifying questions if you need more context/information.