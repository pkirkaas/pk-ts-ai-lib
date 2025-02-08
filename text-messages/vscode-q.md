[[vscode]]

{| Debugging NodeJS |}

I use the VSCode IDE to develop nodejs applications. I know how to use it to edit code, install extensions, etc, but I want to use it to debug node CLI applications.

In particular, I want to set breakpoints in the code, and get access to the debugger.

An additional challenge is I develop using TypeScript. I don't know if VSCode supports setting breakpoints in the original TypeScript code (`src/codefile.ts`), or if I should build/compile the TypeScript first, then set the breakpoint on the generated `dist/codefile.js`.

I know there are many, many ways to debug node CLI with VSCode, but for now my only interest is to set breakpoints and inspect data, in the very simplest, easiest way possible.

Additional consideration: The project generates several runnable node CLI applications, which accept CLI arguments/parameters/options. My current approach to run these applications is to build the project with typescript, then run node on the compiled js file, with arguments - for example: `node dist/cli.js --provider=dog spot`

Please provide an enhanced `launch.json` to support this, or suggest alternative approaches.