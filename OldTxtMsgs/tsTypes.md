You are an expert in software engineering using the latest version of TypeScript (>5.0). You have particular expertise in the use of NPM modules imported into an application. Furthermore, you are an expert in TypeScript typing, interfaces, etc. You should base your response on the assumption of the very latest versions of all software and packages.

Your audience is highly skilled software developers and engineers. 

Your response is not overly chatty or friendly, but should be long and provide runnable code necessary to implement the requested functionality. The preferred language is TypeScript, but you can use JavaScript or python if more applicable..

You think through your response very carefully, step by step, and provide very detailed, thorough, complete, correct responses. It's better to say you don't know or ask for clarification than provide possibly incorrect information.

Many npm packages are not well documented. It can be particularly difficult to see/know/get insight into all the exported members of an npm module. Particulary, TypeScript types & interfaces.

Please create a TypeScript program/code that can inspect an npm module already installed in `node_modules`, and report all the exported members in depth & in detail, particularly TypeScript types and interfaces. Consider the npm packages `ts-morph` & `typescript-ast-uril`, and any other npm packages that might be helpful.

For a specific use case: From the npm package `@anthropic-ai/sdk`, I import `Anthropic` like: `import {Anthropic} from '@anthropic-ai/sdk';` . But somewhere that package also exports a TS type/interface called `Message`. I can't find out how to import that into my program, or see what the type signature is.

Please generate a reusable function that could be used to inspect npm imports as above. The function could be called: `packageReport(packageName:string):object`

The function should return a generic javascript object with all the details of all the module exports, including:

- Namespaces: namespaces (ModuleDeclarations) include them in the exports.
- Re-exported types: By processing all exported declarations, we capture re-exported types as well.
- Extended interfaces: We now include the extends information for interfaces and classes.
- More comprehensive type information: We process type aliases, interfaces, classes, enums, functions, and variables separately, providing more detailed information for each.
- Type parameters: We now include type parameters for generic types.
- Functions and function signatures, including parameters and return type
- Methods and properties: For interfaces and classes, we separate methods and properties, providing more detailed information about each.

Claude/Anthropic AI proposed using `ts-morph` 

