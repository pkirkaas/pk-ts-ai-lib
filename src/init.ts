/**
 * Common export of all libraries used by the project
 */

export * from './oaiLib.js';
export * from './msgs.js';
export * from './constants.js';
export * from './fileops.js';
export * from './togetherai.js';
export * from './hflib.js';
export * from './vertex.js';
export * from './genailib.js';
export * from './lib.js';
export * from './claudelib.js';
export * from './sqliteLib/index.js';
export * from './ts-analysis/index.js';

// NPM Imports
import mime from 'mime';
import fs from 'fs-extra';
import path from 'path';
import _ from "lodash";

//PkLib imports
import {
  PkError, isFile, JSON5Stringify, JSONStringify, writeData,  uniqueVals, strIncludesAny, isSubset,
  askConfirm, inArr1NinArr2, subObj, isEmpty, GenObj, isObject, intersect, dupEntries, strIncludesWhich,
} from 'pk-ts-node-lib';

// Local Imports
//import { AllMsgs, defaultSysMsg, codeFiles } from './constants.js';
import { getCommonTs, } from './fileops.js';
import {mkArray,
} from './msgs.js';

import {
  LogItem, logEntities, getLogDS,
} from './sqliteLib/index.js';

import fncSchema from './FncSchemas/fnc2schema.json' with {type: 'json'};

export { fncSchema };
export type Strings = string | string[];

await getLogDS();
/**
 * The Function Task message, for either single function or array of functions.
 * @param fncs - string fnc name, object with property `name`, or array of such
 */
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
/*
export function expandMsg(msg) {
  let msgKeys = getMsgKeys();
  function wrapKey(key) {
    return `[[${key}]]`;
  }
  let keyMap: GenObj = {};
  for (let key of msgKeys) {
    keyMap[key] = `[[${key}]]`;
  }
  let msgStr = '';
  if (msgKeys.includes(msg)) {
    if (msg in cmpMsgs) {
      msgStr = `\n${mkMsgStr(cmpMsgs[msg])}\n`;
    } else if (msg in AllMsgs) {
      msgStr = `\n${AllMsgs[msg]}\n`;
    } else if (msg in codeFiles) {
      msgStr = `\n${wrapCode(codeFiles[msg])}\n`;
    } else { // Probably meant a key in AllMsgs, but not found
      throw new PkError(`Invalid msg key:`, { msg });
    }
  } else if (wordCnt(msg) > 1) { //msg w. whitespace, use as literal
    msgStr = `\n${msg}\n`;
  } else {
    throw new PkError(`Invalid msg:`, { msg });
  }
  let matched = [];
  let cnt = 0;
  while (strIncludesAny(msgStr, Object.values(keyMap))) {
    matched = strIncludesWhich(msgStr, Object.values(keyMap));
    if (cnt++ > 10) {
      console.log(`expandMsg: too many iterations:`, { msgStr, msg, matched });
      break;
    }

    for (let key of msgKeys) {
      if (msgStr.includes(wrapKey(key))) {
        let repStr = '';
        if (key in cmpMsgs) {
          repStr = mkMsgStr(cmpMsgs[key]);
        } else if (key in AllMsgs) {
          repStr = `\n${AllMsgs[key]}\n`;
        } else if (key in codeFiles) {
          repStr = `\n${wrapCode(codeFiles[key])}\n`;
        } else { // Probably meant a key in AllMsgs, but not found
          throw new PkError(`Invalid msg key:`, { key });
        }
        msgStr = msgStr.replaceAll(wrapKey(key), repStr);
      }
    }
  }
  let embeddeds = findEmbeddeds(msgStr);
  if (!isEmpty(embeddeds)) {
    throw new PkError(`In expandMsg: remaining embeddeds for \nmsg: [${msg}] in \nmsgStr:\n${msgStr}\n\nembeddeds:\n`, { embeddeds });
  }
  return msgStr;
}
  */
/**
 * Recursively expands a message string, replacing keys with values.
 */
/*
export function expandMsgStr(msgStr) {
  function wrapKey(key) {
    return `[[${key}]]`;
  }
  let keys = getMsgKeys();
  let keyMap: GenObj = {};
  for (let key of keys) {
    keyMap[key] = `[[${key}]]`;
  }
  while (strIncludesAny(msgStr, Object.values(keyMap))) {
    for (let key of keys) {
      if (msgStr.includes(wrapKey(key))) {
        msgStr = msgStr.replace(wrapKey(key), keyMap[key]);
      }
    }
  }
}
  */

/**
 * Makes a message string from a string or array of strings.
 * The array of strings can be literal messages, or keys to AllMsgs,
 * which includes system, user, and longer messages found in ./text-message/*.md
 * @param msgs - string or array of strings or arrays of strings, nested as deep as needed
 */
/*
export function mkMsgStr(...msgs): string {
  msgs = msgs.flat(99);
  let dupKeys = dupEntries(msgs);
  if (!isEmpty(dupKeys)) {
    throw new PkError(`in mkMsgStr; dupKeys:`, dupKeys);
  }
  //msgs = uniqueVals(msgs.flat(99));
  let msgStr = '';

  for (let msg of msgs) {
    if (msg in cmpMsgs) {
      msgStr += `\n${mkMsgStr(cmpMsgs[msg])}\n`;
    } else if (msg in AllMsgs) {
      msgStr += `\n${AllMsgs[msg]}\n`;
    } else if (msg in codeFiles) {
      msgStr += `\n${wrapCode(codeFiles[msg])}\n`;
    } else if (wordCnt(msg) > 1) { //msg w. whitespace, use as literal
      msgStr += `\n${msg}\n`;
    } else { // Probably meant a key in AllMsgs, but not found
      throw new PkError(`Invalid msg:`, { msg });
    }
  }
  //TODO: Add default only for system messages
  if (!(msgStr.includes(defaultSysMsg))) {
    msgStr = `${defaultSysMsg}\n${msgStr}`;
  }
  return msgStr;
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




/*
export function extractCodeC3(resStr: string,): CodeBlocks {
  const ret: CodeBlocks = {};
  
  // Create a regex pattern from the language array
  const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');
  
  // Improved regex to handle edge cases and use the dynamic language pattern
  const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\``, 'gim');
  
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(resStr)) !== null) {
    const [fullMatch, lang, code] = match;
    const normalizedLang = lang.toLowerCase().trim();
    
    if (!ret[normalizedLang]) {
      ret[normalizedLang] = [];
    }
    
    const trimmedCode = code.trim();
    if (trimmedCode) {
      ret[normalizedLang].push(trimmedCode);
    }
    
    // Move the lastIndex to the end of this match to avoid overlapping matches
    codeBlockRegex.lastIndex = match.index + fullMatch.length;
  }
  
  return ret;
}
 
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function extractCodeC3(resStr: string,): CodeBlocks {
  const ret: CodeBlocks = {};
  
  // Create a regex pattern from the language array
  const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');
  
  // Improved regex to handle edge cases and use the dynamic language pattern
  const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\``, 'gim');
  
  let match: RegExpExecArray | null;
  while ((match = codeBlockRegex.exec(resStr)) !== null) {
    const [fullMatch, lang, code] = match;
    const normalizedLang = lang.toLowerCase().trim();
    
    if (!ret[normalizedLang]) {
      ret[normalizedLang] = [];
    }
    
    const trimmedCode = code.trim();
    if (trimmedCode) {
      ret[normalizedLang].push(trimmedCode);
    }
    
    // Move the lastIndex to the end of this match to avoid overlapping matches
    codeBlockRegex.lastIndex = match.index + fullMatch.length;
  }
  
  return ret;
}
 
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
  */
