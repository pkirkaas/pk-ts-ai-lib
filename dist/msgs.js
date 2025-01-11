/**
 * Building messages for chat
 */
//PkLib imports
import { PkError, JSON5Stringify, writeData, uniqueVals, strIncludesAny, isSubset, parseArgs, typeOf, ask, inArr1NinArr2, subObj, isEmpty, intersect, dupEntries, strIncludesWhich, } from 'pk-ts-node-lib';
// Local Imports
import { getTxtMsgs, wrapCode, } from './init.js';
/**
 * Check if msgstr contains any unmatched embeddeds - [[.*]], {{.*}}, {|.*|}
 * @param msgStr - string to test
 * @return array of remaining embeddeds
 */
export function findEmbeddeds(msgStr) {
    let regexes = [
        /\[\[(.+?)\]\]/g,
        /\{\{(.+?)\}\}/g,
        /\{\|(.+?)\|\}/gs,
    ];
    let embeddeds = [];
    for (let regex of regexes) {
        let embeds = msgStr.match(regex);
        if (embeds) {
            embeddeds = embeddeds.concat(embeds);
        }
    }
    /*
    let embeddeds = msgStr.match(/\[\[(.+?)\]\]/g);
    if (!Array.isArray(embeddeds)) {
      embeddeds = [];
    }
      */
    return embeddeds;
}
/**
 * Strip comments from msgStr. Don't love the comment syntax,
 * but for now: `{| This is a comment |}`
 */
export function stripComments(msgStr) {
    //  return msgStr.replace(/\/\*[\s\S]*?\*\//g, '');
    let cmtRE = /\{\|(.+?)\|\}/gs; //s for multiline
    //let comments = msgStr.match(cmtRE);
    //console.log({comments});
    msgStr = msgStr.replace(cmtRE, '');
    return msgStr;
}
/** For a msg str, find all embed patterns '[[msgkey]]' & return obj keyed by key & embed
 *
 */
export function findKeyedEmbeds(msgStr) {
    let embeddeds = findEmbeddeds(msgStr);
    let keyedEmbeds = {};
    if (!Array.isArray(embeddeds)) {
        let toEmb = typeOf(embeddeds);
        console.error(`findKeyedEmbeds: msgStr:\n`, msgStr, `\n\ntoEmb ${toEmb}\n\n`, { embeddeds });
        throw new PkError(`findKeyedEmbeds: embeddeds not array`, { embeddeds });
        return keyedEmbeds;
    }
    //let keys = [];
    for (let embedded of embeddeds) {
        let key = embedToKey(embedded);
        keyedEmbeds[key] = embedded;
    }
    return keyedEmbeds;
}
/**
 * Just strip out the [[ ]] from the embed
 */
export function embedToKey(embed) {
    let key = embed.replace(/\[\[(.+?)\]\]/, '$1');
    if (typeof key === 'string') {
        key = key.trim();
    }
    return key;
}
/**
 * Gets all the message keys for all msg objects, ensures no duplicates, & returns array of keys
 */
export function getMsgKeys() {
    //let keyObjs = [getAllMsgs(), codeFiles];
    let keyObjs = [getAllMsgs(),];
    let allKeys = [];
    for (let keyObj of keyObjs) {
        allKeys = allKeys.concat(Object.keys(keyObj));
    }
    let dupKeys = dupEntries(allKeys);
    if (!isEmpty(dupKeys)) {
        throw new PkError(`in getMsgKeys; dupKeys:`, dupKeys);
    }
    return { msgKeys: Object.keys(getAllMsgs()), codeKeys: Object.keys(codeFiles), allKeys };
}
export const askKey = '__ASK__'; // To force an ask
export const wrapPairs = {
    msg: {
        open: '[[',
        close: ']]',
    },
    code: {
        open: '{{',
        close: '}}',
    },
    comment: {
        open: '{|',
        close: '|}',
    },
};
/**
 * Expand arrays of msg keys & msg strings to a single message string. Recursively expands embedded msg keys
 * to msg strings.
 * ?? Switch whether throw error on used key, or just ignore?
 *
 */
export async function expandMsgs(...args) {
    getAllMsgs();
    let { arr: msgs, opts } = parseArgs(args, { ignore: true, addDefault: false, usedKeys: [] });
    let { ignore, addDefault } = opts;
    msgs = mkArray(msgs);
    msgs = uniqueVals(msgs);
    let toMsgs = typeOf(msgs);
    //console.log(`in expandMsgs; msgs:`, { toMsgs, msgs });
    let msgKeyObj = getMsgKeys();
    let { msgKeys, allKeys, codeKeys } = msgKeyObj;
    function wrapCodeKey(key) {
        return `{{${key}}}`;
    }
    function wrapMsgKey(key) {
        return `[[${key}]]`;
    }
    let keyMap = {};
    for (let key of msgKeys) {
        keyMap[key] = wrapMsgKey(key);
    }
    let usedKeys = opts.usedKeys || [];
    let dupKeys = intersect(msgs, usedKeys);
    if (!isEmpty(dupKeys)) {
        console.error(`in expandMsgs; filtering dupKeys:`, dupKeys);
        msgs = msgs.filter(msg => !dupKeys.includes(msg));
    }
    let msgsStr = ''; //The final result
    //Now loop through msg args, expanding to strings
    for (let msg of msgs) {
        if (!msg) { //skip empty or undefined msgs
            continue;
        }
        let msgStr = ''; // The msgStr for this msg
        if (msgKeys.includes(msg)) {
            usedKeys.push(msg);
            if (msg in AllMsgs) {
                msgStr = `\n${AllMsgs[msg]}\n`;
            }
            else if (msg in codeFiles) {
                msgStr = `\n${wrapCode(codeFiles[msg])}\n`;
            }
            else { // Probably meant a key in AllMsgs, but not found
                throw new PkError(`Invalid msg key:`, { msg });
            }
        }
        else if (wordCnt(msg) > 1) { //msg w. whitespace, use as literal
            msgStr = `\n${msg}\n`;
            //} else if (!codeKeys.includes(msg)) { //msg not in AllMsgs or codeFiles
        }
        else if (codeKeys.includes(msg)) { //msg not in AllMsgs or codeFiles
            msgStr = wrapCodeKey(msg);
            //continue;
        }
        else {
            throw new PkError(`Invalid msg:`, { msg });
        }
        //Did initial expansion of msg, now expand embedded keys
        let cnt = 0;
        while (strIncludesAny(msgStr, Object.values(keyMap))) { // Recursively substitute embedded keys, to limit
            if (cnt++ > 10) {
                let matched = strIncludesWhich(msgStr, Object.values(keyMap));
                throw new PkError(`expandMsg: too many iterations:`, { msgStr, msg, matched });
            }
            for (let key of msgKeys) {
                if (msgStr.includes(wrapMsgKey(key))) {
                    let repStr = '';
                    if (usedKeys.includes(key)) {
                        if (!ignore) {
                            throw new PkError(`expandMsgs - key already used:`, { key });
                        }
                        else {
                            //continue;
                        }
                    }
                    else {
                        usedKeys.push(key);
                        if (key in AllMsgs) {
                            usedKeys.push(key);
                            //leftKeys = inArr1NinArr2(leftKeys, usedKeys);
                            repStr = `\n${AllMsgs[key]}\n`;
                        }
                        else if (key in codeFiles) {
                            usedKeys.push(key);
                            //leftKeys = inArr1NinArr2(leftKeys, usedKeys);
                            repStr = `\n${wrapCode(codeFiles[key])}\n`;
                        }
                        else { // Probably meant a key in AllMsgs, but not found
                            throw new PkError(`Invalid msg key:`, { key });
                        }
                    }
                    if (msgStr.includes(repStr) || msgsStr.includes(repStr)) {
                        console.error(`expandMsg: processing embeddeds - msg [${msg}] duplicates key [${key}] w. repStr [${repStr}] already in msgStr`);
                        repStr = '\n';
                        //  throw new PkError(`expandMsg: repStr not in msgStr:`, { msgStr, repStr });
                    }
                    msgStr = msgStr.replaceAll(wrapMsgKey(key), repStr);
                }
            }
        }
        if (msgsStr.includes(msgStr)) {
            console.error(`expandMsg: msgStr [${msgStr}] for msgKey: [${msg}]  already in msgsStr`);
            msgStr = '\n';
        }
        msgsStr += `\n${msgStr}\n`;
    }
    if (addDefault && !(msgsStr.includes(defaultSysMsg))) {
        msgsStr = `${defaultSysMsg}\n${msgsStr}`;
    }
    // Experiment w. removing extra newlines and duplicates
    //msgsStr = msgsStr.replace(/\n\n+/g, '\n\n');
    msgsStr = msgsStr.replace(/\n+/g, '\n');
    let msgsStrArr = msgsStr.split('\n');
    //  msgsStrArr = uniqueVals(msgsStrArr);
    msgsStr = msgsStrArr.join('\n\n');
    msgsStr = stripComments(msgsStr);
    // NOW do code substitution
    for (let key of codeKeys) {
        if (msgsStr.includes(wrapCodeKey(key))) {
            let repStr = '';
            if (usedKeys.includes(key)) {
                if (!ignore) {
                    throw new PkError(`expandMsgs - key already used:`, { key });
                }
                else {
                    //continue;
                }
            }
            else {
                usedKeys.push(key);
                repStr = `\n${wrapCode(codeFiles[key])}\n`;
                msgsStr = msgsStr.replace(wrapCodeKey(key), repStr);
            }
        }
    }
    let embeddeds = findEmbeddeds(msgsStr);
    if (!isEmpty(embeddeds)) {
        throw new PkError(`In expandMsg: remaining embeddeds in \nmsgsStr:\n${msgsStr}\n\nembeddeds:\n`, { embeddeds }, `\nMaybe didn't convert some code embeds to {{.*}} from [[.*]]?`);
    }
    msgsStr = stripComments(msgsStr);
    if (msgsStr.includes(askKey)) {
        let more = await ask("Enhance Question?");
        if (!isEmpty(more)) {
            msgsStr = msgsStr.replace(askKey, more);
        }
    }
    return msgsStr;
}
/**
 * Returns Object with all msg keys to their expanded values
 * @param msgs - opt - array of msg keys to expand, if not provided, all msgs are expanded
 */
export async function getExpandedMsgs(...msgs) {
    let ret = {};
    let keys = getMsgKeys().allKeys;
    if (!msgs.length) {
        msgs = keys;
    }
    else {
        if (!isSubset(msgs, keys)) {
            let invalid = msgs.filter(m => !keys.includes(m));
            throw new PkError(`Invalid msg keys: ${invalid.join(',')}`);
        }
    }
    for (let msg of msgs) {
        ret[msg] = await expandMsgs(msg);
    }
    return ret;
}
export let wrappedSchemaStr = `
This is the \`JSON schema\` describing the \`JSON\` meta data of TypeScript functions, to use to generate Code embeddings for use with RAG training. You must take time, and do a complete, thorough, in-depth job, and focus on correctness. It is essential that your response includes all information possible, as much information as possible, that would support its use for RAG training of an LLM to provide all the information required to enable it as an AI Coding Assistant for the functions. The json schema:

[[fncSchema]]
`;
/**
 * Keys w. source code file path, to be wrapped in triple backticks
 */
export let codeFiles = {
    fsb: 'Q:/Common/Software-Dev/Pythons/similar-images/src/file-system-browser.py',
    fncSchema: './src/FncSchemas/fnc2schema.json',
    ssrSrc: {
        fpaths: "C:/www/NodeTests/NextTests/ssr/next-ssr-demo",
        desc: 'Next.js SSR Demo',
    },
    nextconfs: {
        fpaths: [
            `Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json`,
            `Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.cli.json`,
            `Q:/Common/AI-Experiments/Node/guis/next-basic/next.config.ts`,
            `Q:/Common/AI-Experiments/Node/guis/next-basic/package.json`,
        ],
        desc: 'Next.js Basic Configurations',
    },
    cssmodules: [{
            desc: "The library `tsconfig.json`",
            fpaths: "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json",
        }, {
            desc: "The library `tsconfig.json`",
            fpaths: "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json",
        }
    ],
    fetsconfig: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/tsconfig.json",
        desc: "The TypeScript config file for the FE library `tsconfig.json`",
    },
    fepackage: {
        fpaths: 'C:/www/TypeScriptLibs/Pk-Ts-Fe/package.json',
        desc: "The npm package file for the FE library",
    },
    daisynav: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/daisynav.tsx",
        desc: "Example of responsive DaisyUI navigation bar",
    },
    pknav: {
        //fpaths:"C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/anavbar.tsx",
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/antnav2.tsx",
        desc: "Attempt at a responsive, reusable navigation bar",
    },
    pkfelib: {
        desc: "The configuration files for the `pk-ts-fe-lib` library:",
        fpaths: [
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/tailwind.config.ts",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/vite.config.ts",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/postcss.config.js",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/package.json",
        ],
    },
    mynextapp: {
        desc: "The configuration files for the `my-next-app`, which imports the `pk-ts-fe-lib` library:",
        fpaths: [
            "C:/www/NodeTests/NextTests/ssr/next-2/tailwind.config.ts",
            "C:/www/NodeTests/NextTests/ssr/next-2/next.config.ts",
            "C:/www/NodeTests/NextTests/ssr/next-2/package.json",
            "C:/www/NodeTests/NextTests/ssr/next-2/postcss.config.mjs",
        ],
    },
    /*
  "C:/www/NodeTests/NextTests/ssr/next-2/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js"
    */
    nmnav: {
        desc: "The generated/compiled file containing the `PkNavbar` component, built in configuration files for the `pk-ts-fe-lib` library but installed in the `my-next-app` project in `my-next-app/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js`",
        fpaths: "C:/www/NodeTests/NextTests/ssr/next-2/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js",
    },
    /*
    nextguits: `Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json`,
    nextclits: `Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.cli.json`,
    nextconf: `Q:/Common/AI-Experiments/Node/guis/next-basic/next.config.ts`,
    nextpackage: `Q:/Common/AI-Experiments/Node/guis/next-basic/package.json`,
    */
};
//You are a highly specialized AI assistant focused on accurate software code generation. Provide exact, correct code snippets and minimize unnecessary explanations. Only answer when completely certain.
export let defaultSysMsg = `You are a highly specialized AI Advanced Software Engineering and Development assistant, focused on accurate software code analysis and generation. You are an expert in software design, engineering and development, particularly with \`Python\`, advanced \`JavaScript\` and \`TypeScript\`, assuming the very latest versions of all tools and languages. Compatibility with older versions of any software languages, environments or packages is not required.

For all proposed third party libraries and packages, you will also provide the 'bash' commands to install them via appropriate package managers - \`pip\` or \`npm\`.

Your audience is highly skilled software developers and engineers who require technical, detailed implementable solutions.

Your response is not chatty or friendly, but neither is it just high level conceptual overview.

You consider your answer in depth, carefully, reason through step by step. You will provide a very detailed, thorough, complete, correct response, prioritizing correctness over speed, and provide runnable code necessary to implement the requested functionality.

All the code examples you provide are intended for development/experimentation and Proofs of Concept - **NOT** production use. Performance and efficiency are not important. Simplicity and clarity are very important. Prefer simplicity over efficiency, clarity over efficiency, and synchronous code over asynchronous code. All the code examples you provide should be wrapped in \`\`\`triple backticks\`\`\` with the appropriate language modifiers to indicate that it is code.

Furthermore, your code examples should also indicate the filename/path of the file in which the code should be placed.

You will ask clarifying questions if you need more information for your answer - it is much better to say you don't know than provide possibly incorrect information. Accuracy is essential.

Before you respond, you will review your solution again, and PLEASE, PLEASE take the extra time to double check and ensure legal code & error free code.

`;
export let systemMessages = {
    default: defaultSysMsg,
    code: `[[default]] 
The context is a new software application in very early stages of development and prototyping. Therefore, backward compatibility is not a concern. Production optimization or deployment is not a concern. Performance is not a concern. Legacy code or package support is not a concern. We want to make use of the latest features of all libraries and packages, including beta versions and release candidates. Stability of library packages is not a concern. 

Simplicity and clarity and ease of developer effort are very important. Prefer simplicity over complexity and efficiency, clarity over efficiency, and synchronous code over asynchronous code.

  
Response Requirements:
1. Provide complete, implementable solutions with runnable code
2. Include all necessary imports and setup
3. Specify file paths and structure
4. Include package installation commands (pip/npm)
5. Focus on clarity and correctness over optimization
6. Assume audience is experienced software engineers
7. Provide step-by-step technical explanations when needed
8. Ask clarifying questions if requirements are unclear

Code Requirements:
1. All code must be wrapped in language-specific triple backticks
2. Include file paths/names for all code blocks
3. Provide complete, self-contained solutions
4. Focus on readability over performance
5. Include error handling for critical operations
6. Add explanatory, technical comments throughout the code
7. Consider & handle all possible edge cases
8. Add complete documentation for each code module (function/class/etc) in the language appropriate doc comment format for the language ('tsdoc' for 'typescript', 'pydoc' for 'python', etc.), including purpose, usage, parameter specification, return, etc.

Do not:
1. Include unnecessary conversation or pleasantries
2. Provide partial or conceptual-only solutions
3. Skip error handling in critical code
4. Make assumptions about unclear requirements
  `,
    python: `[[code]] You are an expert in modern Python (v >= 3.10) software development and engineering. You are an expert in the latest versions of all python  libraries, packages, frameworks and tools. 

  For all Python code examples you provide, ensure you provide the \`bash\` command to install the required Python packages, and the \`pip\` command to install the required Python packages.
  `,
    ai: `[[default]] You also have advanced expertise in developing custom AI agents and assistants written in Python and TypeScript/JavaScript, using multiple LLMs, running locally or through cloud based APIs (\`Open AI API\`, etc), including tuning LLM configuration parameters like \`temperature\`, \`topP\`, etc. You specialize in advanced RAG Training and Fine Tuning of models for adding specialized expertise to custom LLMs.

  Additionally, you are deeply familiar with all the latest AI frameworks and tools, including \`LangChain\`, \`LlamaIndex\`, \`GPT4All\`, \`Llama.cpp\`, etc., for both Python and JavaScript/TypeScript, used to develop custom AI agents and assistants, and to fine tune and train custom LLMs, as well as free/open source vector storage databases, etc.
  
  `,
    pyapp: `[[pyqt]] The goal is to create portable Python windowed/GUI applications that can be run on any Windows, macOS, or Linux system, using  the latest version of the \`PyQt\` library to create the portable GUI for the application. 

  To localize python dependencies, we use python virtual environments and the latest versions of the \`pdm\` python package manager.
  
  The applications will be very modular, consisting of a main application window, with a menu bar, a status bar, etc, and multiple reusable widget modules, each with a separate python file, which can be used in multiple applications, and can return data to the main application and other modules. 

  In all cases, particularly the main application window, whenever a widget/component contains multiple sub-widgets/components, the main widget will be a container widget, and the sub-widgets will be added to the main widget as child widgets. The container widgets will implement vertical and horizontal layouts and resizing handles.

  For example, there will be a file system browser module/widget which allows the user to browse the file system, and select files and directories, and return the selected files and directories to the main application.

  The results of the file selection widget/browser might be returned to the main application as a list of file path strings, which might then use the selected files to load into a multi-image-viewer widget that displays the selected image files in a grid, and allows the user to select an image to view in a separate window.

  The applications are all undergoing active development and debugging. During development, the applications will be run from the command line, and the output of the application will be displayed in a separate window. All actions will be logged to a log file and the terminal.

  `,
    aicodetrain: `[[ai]] The goal is to additionally train a pre-trained coding LLM ('gpt-4o', 'llama-3.2', etc) on custom code bases/libraries, to enable the LLM to act as a coding assistant for the specialized code base as well as for general coding.

  The training methods can be 'RAG' (Retrieval Augmented Generation) or 'Fine Tuning' (Fine Tuning), a combination of both, or other approaches you suggest.

  I already have implemented multiple multi-shot chatbot agents/applications in both Python and JavaScript, using the OpenAI API, Anthropic API, and Google Vertex which I can run from a command line terminal, which can answer multiple coding questions with follow-up questions, which can be used as assistants for general coding.

  The challenge is to implement custom code training on custom code bases. The software languages can be restricted to 'python', 'javascript' & 'typescript'. That requires several steps and additional libraries and utilities. I have a local vector database/store installed - 'ChromaDB' - but I am open to other open source vector stores that can run locally - 'FAISS', 'Weaviate', or others. I am not interested in cloud or managed vector DBs. I also have several large code bases to train on.

  The code bases need to be prepared, split into smaller chunks, and the metadata for each function needs to be extracted and stored in a vector database.
  `,
    js: `[[code]] You are an expert in advanced techniques with modern JavaScript ('ES2022' and greater) software development and engineering, using the \`npm\` package management system, advanced configuration with \`package.json\`, and all relevant, latest versions of 'npm' packages. Prefer 'ESM' 'import' module syntax  over 'CommonJS' 'require' module syntax. For all \`npm\` packages you suggest, use the latest versions and include the \`npm install\` command for the packages in your responses.
  `,
    ts: `[[js]] You are an expert in advanced techniques with modern TypeScript (version >= 5.6) software development and engineering, including advanced typescript build configurations and options with \`tsconfig.json\`.
  `,
    node: `[[ts]] You are an expert in configuration, operation, options for the latest Node.js (version >= 23) development and engineering, and all relevant, latest versions of 'npm' packages. Prefer 'ESM' 'import' module syntax  over 'CommonJS' 'require' module syntax.
  `,
    sql: `[[code]] You are an expert in advanced techniques with modern SQL design, queries, best practices, indexing, etc. You have particular expertise in PostgreSQL (version >= 16) and SQLite (version >= 3.44).
`,
    typeorm: `[[sql]] [[node]] You are an expert with the \`TypeORM\` ORM Library (version >= 0.3.20) with SQLite and PostgreSQL, particularly with Entity definitions, including advanced column and relationship definitions, and advanced queries, including joins, subqueries, and advanced joins. We exlusively use the \`Active Record\` pattern for TypeORM, all Entities extend the \`BaseEntity\` class.
`,
    aiprep: `[[ai]] I have prepared the data for my 100 TypeScript functions by extracting metadata about each function in JSON format. The metadata for each function is in the format specified by the \`json-schema\` that follows below. `,
    embedding: `The next step is to generate embeddings from this metadata. I know there are multiple ways to generate embeddings, including Hugging Face Transformers, models like CodeBERT, etc, and GNNs, etc.

 Your task is to consider all practical approaches to generating the embeddings from the structured \`json\` data according to the schema, evaluate pros and cons of each approach, and provide TypeScript code examples for each.
 `,
    pyqt: `[[python]] You are an expert with the \`PyQt6\` Python library for creating graphical user interfaces (GUIs), and all available widget libraries.

You will provide a complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.

 `,
    win: `[[default]] You are and expert in the latest version of the 'Microsoft Windows 11 Professional' operating system, with particular expertise in advanced configuration, operation, registry settings, etc.
 `,
    tsfnc: `I know the code should be prepared and commented and chunked, etc, but I don't want to do that myself - I want to use AI to do it all for me. I already have written a Chat application in TypeScript using the OpenAI API Node / TypeScript client, and I have a vector database installed on my local development machine.
  `,
    tsanalyze: `[[ts]] You have particular expertise analyzing, developing, understanding and documenting TypeScript/JavaScript on a deep level. Your analysis of the code will focus on how to parse and extract relevant elements of the code for use with LLM RAG training & generating useful embeddings.`,
    auto: 'Your response will be automatically inserted into a database. Therefore, your response should not include any chat comments - only the output specified. Do **NOT** wrap your response with triple backticks. DO NOT wrap the TypeScript function body code with "```typescript...```". Only the plain text of your response and nothing else.',
    // Define a TS Function body */
    tsfncbody: `Below follows TypeScript sourcecode containing about 100 export definitions, including TypeScript functions.  
  
  For the purpose of this task, a function definition includes any TypeScript comments in \`TsDoc\` format (\`/** ... */\`) (if any) which immediately precedes the the function signature, the function signature/call, and the function body/code block, including the opening and closing braces. Remember to consider/include any relevant TypeScript comments that immediately precede the function definition which might include context and understanding of the function.
  `,
    webapp: `[[typeorm]] [[react]] The project is a full-stack web application with a front-end built with the latest 'React' 19 and a back-end built with NodeJS and 'express'. The backend API database is \`sqlite\`, using the TypeScript \`typeorm\` ORM library.

  The project is in very early stages of development and prototyping. 
  `,
    webappauth: `[[webapp]]The application supports user creation/registration, login, authentication and authorization by email/password or third party auth providers such as Google, Facebook, etc.
  `,
    nextssr: `[[webapp]] 
  We use the latest \`nextjs\` framework (version >= 15), with the NextJS \`App Router\` for server-side-rendering (SSR), using the latest React 19 features to use \`React Server Components\` and \`React Server Actions\` to reduce development time and complexity by allowing the SSR components to initialize data directly from the server services without the need for client-side API data fetching. We use the latest \`tailwindcss\` version > 3.4, as well as \`daisyui\` & \`react-daisyui\` for UI components.
  

  You are an expert with the \`NextJS\` framework, particularly with configuration (\`next.config.ts\`), including \`webpack\` configuration, the \`App Router\` and \`React Server Components\` and \`React Server Actions\`.

  `,
    tailwind: `[[react]] You are an expert with the latest \`tailwindcss\` (version >= 3.4.17) framework, particularly with configuration (\`tailwind.config.js\`), including \`webpack\` configuration, the \`App Router\` and \`React Server Components\` and \`React Server Actions\`. You are an expert with the \`daisyui\` & \`react-daisyui\` UI component libraries and the \`tailwindcss\` plugins.
  `,
    react: `[[ts]]  You have particular expertise in the latest features of the new React version (>= 19) for SSR, particularly \`React Server Components\` and \`React Server Actions\`,  using the latest \`NesxJS\` version >= 15,  as well as all the latest react npm libraries.`,
    rcomp: `[[react]] Your task is to create a reusable, configurable, customizable React component as described below. Use existing React libraries and components as building blocks where appropriate, again focusing on simplicity and ease of use/implementation for a single developer. Bundle size is NOT a concern. Minimizing the number of lines of custom code/implementation IS a priority.

  Use the latest features of the new React version (>= 19), in a NextJS application, taking advantage of the latest NextJS framework for SSR & RSC, particularly \`React Server Components\` and \`React Server Actions\`.
  
  Prefer using \`React Server Components\` and \`React Server Actions\` for server-side rendering and data fetching, but you can use Client Components if necessary.

  Also use stable, maintained and well-documented React libraries and components in your solution where appropriate to  avoid reinventing the wheel.

  Take extra effort to ensure that your solution is well-documented, well-tested, and easy to use.
  `,
    reactcss: `[[react]] [[tailwind]] There are many advanced techniques and libraries for styling React components, including \`styled-components\`, \`emotion\`, \`css-modules\`, \`css-in-js\` libraries, etc. You are an expert with all of these libraries and techniques, including the latest advanced 'CSS' features, 'SASS' & 'SCSS', 'postcss', 'tailwindcss', etc.

  You have expertise with the latest component libraries for React, including \`DaisyUI\`, \`react-daisyui\`, \`react-bootstrap\`, etc. 
  `,
    vite: `[[reactcss]] You are an expert in the latest version of the \`Vite\` build tool, including all the latest features and configuration options.`,
    reactemotion: `[[reactcss]] You are an expert in the latest versions of all the \`emotion\` family of npm styling libraries including:
- "@emotion/css"
- "@emotion/react"
- "@emotion/styled"
- "@mui/icons-material"
- "@mui/material"
- "@mui/system"
  
They are very powerful and feature rich, but offer different features and capabilities, and furthermore can be very confusing particularly as different packages export functions with the same name but very different behaviors, such as \`css\` and \`styled\`. Your are expert in all of them, and can provide detailed guidance on which to use in different situations, particularly disambiguating between exports with the same name but different behaviors.
`,
};
export let usrMessages = {
    pqt: `[[python]] You are an expert with the \`PyQt6\` Python library for creating graphical user interfaces (GUIs), and available widget libraries.

  You will provide a complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.`,
    pqtBrowser: `[[pqt]]  The sample project should be a simple file system browser, with a tree view of the file system and some way to select multiple files and directories.
  `,
    embeddings: `[[ai]] [[aiprep]] [[embedding]]  ${wrappedSchemaStr}`,
    aicodeprep: `The code needs to be prepared and commented and chunked, etc, but I don't want to do that myself - I want to use AI to do it all for me. I know this will require several steps and additional libraries and utilities. I also know that different LLMs are more suitable for code preparation/chunking/etc than the LLMs that I want to use for the actual coding assistant.
  `,
    aicp1: `[[aicodeprep]] Please provide a detailed guide on how to prepare the code for use with an LLM, using another AI LLM, including the steps and tools required, with recommendations and alternatives.
  `,
    aicp2: `[[aicp1]]
  Let's take one language code base at a time - for now, 'typescript'. I have several large libraries of 'typescript' functions/utilities, as well as many applications that use the libraries. Should I separate the processing of the  the code libraries that implement the library components from the source code of the applications that use the libraries?
  `,
    pqtAppFramework: `[[pqt]]  The sample project is a runnable windowed application with a top menu bar, containing 3 menu items - 'file', 'help', and 'about'.
  
 The 'file' menu should have 3 sub-menu items - 'open', 'save', and 'save as'.

 Selecting the 'open' menu item should open a file dialog to select a file to open. The 'save' and 'save as' menu items should open a file dialog to select a file to save to.

 The 'help' menu item should open a component that only says "This is the help component", and contains a "close" button.
 
 The 'about' menu item should open a component that only says "This is the about compnonent", and includes a "close" button.
 
 Create the appropriate components for each described.

 Your response should include the complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.
  `,
    aiapiparams: `[[ai]] I am using the OpenAI API chat completions endpoint to generate and answer questions about software code (\`python\`, \`typescript\`, \`javascript\', etc). I want the responses to be as accurate as possible. Aside from the system and user messages, there are multiple other parameters for the chat completions endpoint - \`temperature\', \`top_p\`, \`frequency_penalty\`, \`presence_penalty\`, etc.

  Please recommend the best values for the parameters for the chat completions endpoint to generate the most accurate responses to questions about software code, and provide a brief explanation of why you recommend those values.
  `,
    rag: ``,
    tsdecls: `Below follows TypeScript sourcecode containing multiple exports.  Please provide a JSON array of objects for every export. Each object should have only the following properties: 'type' & 'name'. If the type is a class, provide the class name as the 'name'. If the type is a function, provide the function name as the 'name'. If the type is a variable, provide the variable name as the 'name'. If the type is an interface, provide the interface name as the 'name'. If the type is an enum, provide the enum name as the 'name'. If the type is a type alias, provide the type alias name as the 'name'. If the type is a union type, provide the union type name as the 'name'. If the type is a tuple type, provide the tuple type name as the 'name'.

  Only that & nothing more. Wrap the JSON array in triple backticks with followed by 'json' indicating the type of the content.

  `,
    utsfncbody: `Your task is to extract and return the function definition for the function named below. Remember to include any relevant TypeScript comments that immediately precede the function definition which might include context and understanding of the function. Your response should consist ONLY OF TypeScript code wrapped by triple backticks for TypeScript. Only that and nothing more.`,
};
export let AllMsgs = {};
/**
 * Combine all the message objects into a single object, checking for duplicate keys.
 */
export function getAllMsgs(...msgObjs) {
    let ret = {};
    let initMsgObjs = { systemMessages, usrMessages, txtMsgs: getTxtMsgs(), };
    for (let msgObjKey in initMsgObjs) {
        let msgObj = initMsgObjs[msgObjKey];
        let iKeys = intersect(Object.keys(ret), Object.keys(msgObj));
        if (iKeys.length) {
            throw new PkError(`in getAllMsgs; duplicate keys in msgObj [${msgObjKey}]:`, iKeys);
        }
        ret = { ...ret, ...msgObj };
    }
    AllMsgs = ret;
    return AllMsgs;
}
export async function getAllMsgsByObj() {
    let initMsgObjs = { systemMessages, usrMessages, txtMsgs: getTxtMsgs(), codeFiles };
    let ret = {};
    for (let msgObjKey in initMsgObjs) {
        let msgObj = initMsgObjs[msgObjKey];
        let iKeys = intersect(Object.keys(ret), Object.keys(msgObj));
        if (iKeys.length) {
            throw new PkError(`in getAllMsgsByObj; duplicate keys in msgObj [${msgObjKey}]:`, iKeys);
        }
    }
    let expMsgObjs = {};
    for (let msgObjKey in initMsgObjs) {
        let msgObj = initMsgObjs[msgObjKey];
        let expMsgObj = {};
        for (let msgKey in msgObj) {
            let msg = msgObj[msgKey];
            expMsgObj[msgKey] = { msg, expMsg: await expandMsgs(msgKey) };
        }
        expMsgObjs[msgObjKey] = expMsgObj;
    }
    return expMsgObjs;
}
/*

export let tstAnTasks = {
  lstFncs: " to process and parse the typescript code that follows and just return a list of all the functions defined in the code. Do not include any comments or explanations. Just return the list of functions.",

  docForObjInfo: " create full, complete, detailed and accurate documentation for the function `objInfo` defined in the code. Your documentation should be in the form of a markdown table with the following columns: function name, function description, function parameters, function return value, function return type, function return description.",

  docForAll: " create full, complete, detailed and accurate documentation for each function defined in the code. Your documentation should be in the form of markdown, with `GitHub` markdown syntax, and include a table of contents. Each function should be documented under a markdown header with the function name. The documentation section for each function should start with a markdown table with the following columns: function name, function description, function parameters, function return value, function return type, function return description. For each function definition section, the table should be followed by full documentation of the function including the function signature, function description, function parameters with types, function return value, function return type, function return description, and examples .",

  tsDoc: "TODO",

  jsonChunk: " create json chunks for each function of the typescript code that follows, in a single JSON output, which includes every function defined. Each chunk should be a json object with the key as the function name, with the content/value the json escaped typescript code for the function. The json chunk should be a single line json object.",
};
*/
//export function tstMsgStr(msgs: string | string[]): string {
export async function tstMsgStr(...msgs) {
    let inpMsgs = JSON5Stringify(msgs);
    let msgStr = await expandMsgs(...msgs);
    let outPath = `./out/msg-test-${Date.now()}.md`;
    writeData(`# Test Msg Generation\n**Input Msgs:**\n\n${inpMsgs}\n\n**Generated:**\n\n${msgStr}\n`, outPath);
    return msgStr;
}
/**
 * If the arg is not an array, put it into an array
 */
export function mkArray(arg) {
    if (!Array.isArray(arg)) {
        if (!arg) {
            arg = [];
        }
        else {
            arg = [arg];
        }
    }
    return arg.flat(99);
}
// Map keys to usr/system messages
export let MsgSets = {};
/**
 * Test message keys - write to file & return
 * @param msgs - string | string[] | null
 *   if null, all keys & msgs
 *   if string/string[], check keys exist, output subset
 */
export function tstMsgKeys(msgs) {
    let lAllMsgs = getAllMsgs(); // as GenObj;
    //getAllMsgs(); // as GenObj;
    if (!isEmpty(msgs)) {
        let amkeys = Object.keys(AllMsgs);
        msgs = mkArray(msgs);
        let badKeys = inArr1NinArr2(msgs, amkeys);
        if (!isEmpty(badKeys)) {
            console.log(`Msg keys not in AllMsgs:`, badKeys);
            return;
        }
        lAllMsgs = subObj(AllMsgs, msgs);
    }
    let outPath = `./out/msg-key-test-${Date.now()}.json5`;
    writeData(lAllMsgs, outPath);
    return lAllMsgs;
}
export function wordCnt(str) {
    if (typeof str !== 'string') {
        throw new PkError(`In wordCnt - str is not a string:`, { str });
    }
    const array = str.trim().split(/\s+/);
    return array.length;
}
//# sourceMappingURL=msgs.js.map