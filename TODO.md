# TODO for AI-Lib

- Re-implement the function doc tasks
- Make msgStr overloaded to support more msg arg types - also system
- Refactor provider constants
- Clean build msg, esp for code, & checking for remaining tags
- Abstract client libs in subdir, add client to provider constants - most use OpenAI client, even if other providers - then easier to abstract rest
- Continue abstract client libs, testing lms, commander script
- Really work the Vercel AI SDK
- Implement new tests in Commander
- Continue abstraction combining client classes & sdk clients
- NORMALIZE/IMPROVE naming/exports
- customize filterModels for TogetherAI - so many models, types, etc
- Also maybe pick/omit opt keys for filterModels - maybe custom per provider, like pricing for Together?
- Work more on exporting as lib
- Handle tags in CLI followup input
