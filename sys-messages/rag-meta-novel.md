[[ai]]

The RAG training should be on several novels.

The RAG training should support both identifying novel by content questions, like:

- Which novel has the character `Daryl Saroyan`?
- Which novel involves international espionage with making a movie in Hollywood? 

But should also support answering questions about content, based on the novel, like:

- In what time period is the novel  `The Sun Also Rises` set?
- Who are the main protagonists in the novel `Smileys People`?

"Linked Metadata"
- Store chunks and metadata separately with reference IDs
- Join metadata during retrieval or response generation

I am considering the following structures for the metadata and chunked data:


Metadata Structure (per novel)

```json
{
  "novel_id": "unique_identifier",
  "title": "The Sun Also Rises",
  "author": "Ernest Hemingway",
  "publication_year": 1926,
  "genre": ["Modernist novel", "Fiction"],
  "characters": ["Jake Barnes", "Lady Brett Ashley", "Robert Cohn"],
  "settings": ["Paris", "Pamplona", "1920s"],
  "themes": ["Lost Generation", "Post-war disillusionment"]
}
```

## Chunking

- Implement semantic chunking to preserve narrative context
- Maintain character references and key plot elements within chunks
- Create overlapping chunks (100-200 token overlap) to maintain continuity
- Generate unique identifiers for each chunk linked to its parent novel

Chunk Structure:
```json
{
  "chunk_id": "hemingway_sun_also_rises_043",
  "novel_id": "hemingway_sun_also_rises",
  "sequence": 43,
  "text": "The actual text content of this segment...",
  "characters_present": ["Jake Barnes", "Lady Brett Ashley"],
  "setting": "Paris café"
}
```













