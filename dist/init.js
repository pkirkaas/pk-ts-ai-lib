/**
 * Common export of all libraries used by the project
 */
export * from './oaiLib.js';
export * from './msgs.js';
export * from './llmLibs/clientLibs.js';
export * from './constants.js';
export * from './fileops.js';
export * from './hflib.js';
export * from './vertex.js';
export * from './genailib.js';
export * from './lib.js';
export * from './aisdklib.js';
export * from './claudelib.js';
export * from './sqliteLib/index.js';
export * from './ts-analysis/index.js';
//PkLib imports
import { PkError, isObject, mkArray, } from 'pk-ts-node-lib';
import { getLogDS, } from './sqliteLib/index.js';
import fncSchema from './FncSchemas/fnc2schema.json' with { type: 'json' };
export { fncSchema };
await getLogDS();
/**
 * The Function Task message, for either single function or array of functions.
 * @param fncs - string fnc name, object with property `name`, or array of such
 */
/*
export function fncTask(fncs): Strings {
  let fncTask: string;
  function wrapName(el) {
    if (isObject(el)) {
      el = el.name;
    }
    if (typeof el !== 'string') {
      throw new PkError(`Invalid arg to wrapName - el:`, { el });
    }
    return `\`${el}\``;
  }
  //fncNames = mkArray(fncNames);
  if (Array.isArray(fncs)) {
    let wrappedNames = fncs.map((fnc) => wrapName(fnc));
    let fncNames = wrappedNames.join(',');
    let cnt = wrappedNames.length;
    fncTask = `\nYour task is to return **ONLY** a \`JSON\` array of \`JSON\` objects, each of which MUST conform to the specified  \`JSON schema\` that follows, for each of the ${cnt} functions: ${fncNames} defined in the TypeScript source code that follows.\n`;
  } else {
    fncTask = `\nYour task is to return **ONLY** a \`JSON\` object which MUST conform to the specified  \`JSON schema\` that follows, for the function ${wrapName(fncs)} defined in the TypeScript source code that follows.\n`;
  }

  let wrappedSchema = `
This is the \`JSON schema\` describing the \`JSON\` data you should return, per function, for RAG training. You must take time, and do a complete, thorough, in-depth job, and focus on correctness. It is essential that your response includes all information possible, as much information as possible, that would support its use for RAG training of an LLM to provide all the information required to enable it as an AI Coding Assistant for the functions.

\`\`\`json
${JSON.stringify(fncSchema, null, 2)}
\`\`\`\n`;
  //return str + wrappedSchema;
  let msgArr = ['default', 'tstGen', fncTask, getCommonTs(), wrappedSchema, 'pureJson'];
  return msgArr;
}
  */
/**
 * From an array of objects, return element with name === name
 */
export function getByName(arg, name) {
    arg = mkArray(arg);
    for (let el of arg) {
        if (!isObject(el) || !el.name) {
            throw new PkError(`Invalid el in arg for 'getByName'`, { el, arg });
        }
        if (el.name === name) {
            return el;
        }
    }
    console.error(`No el matched [${name}]`, { arg });
    return false;
}
//# sourceMappingURL=init.js.map