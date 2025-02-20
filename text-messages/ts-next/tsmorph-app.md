[[tsmorph]]

{| Create TS Morph application to analyze and capture TS Codebase |}

My long term goal is to RAG train an LLM on various large TypeScript libraries and packages, from a single entry point/root for the library, either a local filesystem base directory or a GitHub URL.

This is a multi-step project to be implemented one step at a time. The first step is to develop a NodeJS/TypeScript program to analyze a TypeScript source code library to extract and persist all relevant information about the source code. 

Let's make the first iteration even simpler than that. Let's focus on **ALL** TypeScript interfaces and types defined/declared in the project. This is complicated enough because:

- interfaces can be based on other interfaces and types
- Types can be based on other types, interfaces, and can be composed by unions
- Ultimately, all types and interfaces are composed of JavaScript primitives and TypeScript generics, etc.

The goal is to discover every TS `type` and `interface` declared in the library, and all the signatures/type declarations for each.

Let's also forget about persisting the result for now - the result can be just a JavaScript object containing all the information.

Below I describe my thoughts on how the result should be structured, but you are free to suggest alternatives.

- The result object should have 2 keys - `interfaces` & `types`
- The value for the `interfaces` key should be an object whose keys are the names of all the interfaces declared in the project. Similarly, the value for the `types` key should be an object keyed by all the TS types declared in the project.
- The value for each interface/type name should be an array of all TypeScript type/interface signatures for data that would satisfy the type/interface. I'm not sure the best format/structure for each signature - maybe a string? Or a structure/object representing an abstract TS type/interface definition. Suggest an approach/structure.

For interface/type signatures, each signature should be a structured object representation (decomposed into properties)

For nested/referenced types and interfaces, we should fully resolve and expand all references

For generic types/interfaces, we should both:
- Capture with generic parameters as defined
- Try to resolve with concrete types where possible

For handling union types, we should both:
- Represent as a single signature with union
-  Generate separate signatures for each union member

Please ensure handling of:
- Circular type references
- Complex generic type constraints
- Mapped types

For both Type and Interface definitions, add the property `srcFiles` as a `string[]` of all the file paths in the project that define/declare that Type/Interface.

Also modify the analysis code to reflect this enhancement and include filepaths in the results.

The input to the program should be a local project directory path. The program should ignore subdirectory paths like `node_modules`, `dist`, `.git`, `git-hooks`, `deprecated`, `logs`, `tmp`, etc.

The program should create a JavaScript object described above; the return/output of the program should be the JSON stringified result of the object.

I would approach it using the npm packages `ts-morph` and `typescript`, but suggest alternatives or additional packages if you recommend.

Please generate the specified code, or ask clarifying questions first if necessary.



