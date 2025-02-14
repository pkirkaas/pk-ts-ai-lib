"use strict";
/**
 * Common export of all libraries used by the project
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.fncSchema = void 0;
__exportStar(require("./oaiLib.js"), exports);
__exportStar(require("./msgs.js"), exports);
__exportStar(require("./llmLibs/clientLibs.js"), exports);
__exportStar(require("./constants.js"), exports);
__exportStar(require("./fileops.js"), exports);
__exportStar(require("./hflib.js"), exports);
__exportStar(require("./lib.js"), exports);
__exportStar(require("./sqliteLib/index.js"), exports);
__exportStar(require("./ts-analysis/index.js"), exports);
// Tests
__exportStar(require("./tests/zod-schemas.js"), exports);
var index_js_1 = require("./sqliteLib/index.js");
var fnc2schema_json_1 = __importDefault(require("./FncSchemas/fnc2schema.json"));
exports.fncSchema = fnc2schema_json_1["default"];
with ({ type: 'json' })
    ;
await index_js_1.getLogDS();
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
//# sourceMappingURL=init.js.map