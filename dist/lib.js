/**
 * General (non-API dependent) functions
 */
import setTitle from 'console-title';
// PkLib Imports
import { typeOf, writeData, ajvSchema, isSimpleObject, PkError, isEmpty, mkArray, isString, ask, dtFmt, strIncludesAny, } from 'pk-ts-node-lib';
// Local Imports
import { 
//geminiChatTask, 
//mkMsgStr,
fncSchema, providers, } from './init.js';
/*
export function getApiKey(provider = null) {
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  let apiKey = config.apiKey;
  return apiKey;
}
  */
/**
 * Make options for model list - sort, format, filter
 */
export function mkModelListOpts(opts = {}) {
    let listOptsDef = { sort: 'created', format: true, filter: '', };
    opts = { ...listOptsDef, ...opts };
    return opts;
}
export function filterModelObjArr(modelObjs, opts = {}) {
    let listOptsDef = { sort: 'created', format: true, filter: '', };
    let { sort, format, filter } = { ...listOptsDef, ...opts };
    if (filter) {
        let filters = mkArray(filter);
        modelObjs = modelObjs.filter((modelObj) => {
            if (modelObj.id) {
                //return modelObj.id.toLowerCase().includes(filter.toLowerCase());
                return strIncludesAny(modelObj.id, filters, true);
            }
            else if (modelObj.name) {
                return strIncludesAny(modelObj.name, filters, true);
                //return modelObj.name.toLowerCase().includes(filter.toLowerCase());
            }
            else { // What to filter on?
                return true;
            }
        });
    }
    if (sort) {
        let sortBy;
        if (isString(sort)) {
            sortBy = sort;
        }
        else {
            sortBy = 'created';
        }
        let cmpFnc = (a, b) => {
            if (a[sortBy] === b[sortBy]) {
                return 0;
            }
            if (!(a[sortBy])) {
                return -1;
            }
            if ((!b[sortBy])) {
                return 1;
            }
            return b[sortBy] > a[sortBy] ? -1 : 1;
        };
        modelObjs.sort(cmpFnc);
    }
    if (format) {
        modelObjs = modelObjs.map((modelObj) => {
            //let { id, created, } = modelObj;
            if (modelObj.created) {
                modelObj.createdAt = dtFmt('short', modelObj.created * 1000);
            }
            return modelObj;
        });
    }
    return modelObjs;
}
/**
 * Return the provider key (lms, ollama)
 * @param {string} provider - ollama' - if null, use llmProvider if set, else ask
 * @returns {string}
 */
export function getLlmProvider(provider = null) {
    if (!provider) {
        provider = askLlmProvider();
    }
    if (provider && Object.keys(providers).includes(provider)) {
        setTitle(provider);
        return provider;
    }
    else {
        throw new PkError(`No provider found for ${provider}`);
    }
}
export function getProviderConfig(provider = null) {
    provider = getLlmProvider(provider);
    return providers[provider];
}
;
export function validateJson(data) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    if (!isSimpleObject(data)) {
        let tod = typeOf(data);
        throw new PkError(`validateJson - Invalid type [${tod}] for 'data':`, { data });
    }
    let validate = ajvSchema(fncSchema, { strictSchema: false });
    let valid = validate(data);
    if (!valid) {
        throw new PkError(`Invalid FncSchema data:`, { data, errors: validate.errors });
    }
    return data;
}
export function mkRepPath(lbl = 'log-out', ext = 'md') {
    return `./out/${lbl}-${Date.now()}.${ext}`;
}
export function writeLog(str, { lbl, ext } = {}) {
    let lpath = mkRepPath(lbl, ext);
    writeData(str, lpath);
}
//export function matchPattern(str: string, patterns: string[]): boolean {
/**
 * Test if a string matches any of the standard unix GLOB patterns.
 * @param {string} str - The string to test.
 * @param {string|string[]} patterns - An array of standard unix GLOB patterns.
 * @returns {boolean} - True if the string matches any of the patterns, false otherwise.
 */
export function matchPattern(str, patterns) {
    let patternArr = mkArray(patterns);
    const globToRegex = (glob) => {
        const escaped = glob.replace(/[.+^$(){}|[\]\\]/g, '\\$&'); // Escape special regex chars
        const regexStr = `^${escaped.replace(/\*/g, '.*')}$`; // Replace `*` with `.*`
        return new RegExp(regexStr);
    };
    return patternArr.some(pattern => globToRegex(pattern).test(str));
}
/** Return providers - array of strings or configs
 * @param {boolean} list - if true, return array of strings, else return object
 */
export function getProviders(list = true) {
    if (list) {
        return Object.keys(providers);
    }
    return providers;
}
/**
 * Takes a msg key or array of msg keys & returns a string of the message keys
 */
export function stringifyMsgs(msgs) {
    msgs = mkArray(msgs);
    if (msgs.length === 1) {
        return msgs[0];
    }
    let msgsStr = `[${msgs.join('][')}]`;
    return msgsStr;
}
export async function askLlmProvider() {
    let choices = getProviders();
    let provider = await ask('What LLM Provider to use?', { choices });
    return provider;
}
;
/**
 * Strips opening & closing backticks from text response
 */
export function stripBackticks(str, lbl) {
    if (isEmpty(str)) {
        return str;
    }
    lbl = lbl || 'typescript';
    let cbts = '```';
    let obts = cbts + lbl;
    if (!(str.startsWith(obts))) {
        return str;
    }
    if (!str.endsWith(cbts)) {
        throw new PkError(`stripBackticks - opend with [${obts}] but not closed. STR: \n\n${str}\n\n`);
    }
    str = str.substring(obts.length);
    str = str.substring(0, str.length - cbts.length);
    return str;
}
//# sourceMappingURL=lib.js.map