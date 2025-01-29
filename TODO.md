# TODO for AI-Lib

- Re-implement the function doc tasks
- Make msgStr overloaded to support more msg arg types - also system
- Create generic chat function that calls specific chat functions based provider
- Refactor provider constants
- Complete new buildMsg by adding wrapCode, and test w. lots of weird msg keys/vals
- Clean build msg, esp for code, & checking for remaining tags
- Abstract client libs in subdir, add client to provider constants - most use OpenAI client, even if other providers - then easier to abstract rest
- Continue abstract client libs, testing lms, commander script
- OR - Pivot to Vercel AI SDK
- Really work the Vercel AI SDK
- Implement new tests in Commander
