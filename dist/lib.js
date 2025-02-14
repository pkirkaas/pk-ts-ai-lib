"use strict";
/**
 * General (non-API dependent) functions
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.stripBackticks = exports.askLlmProvider = exports.stringifyMsgs = exports.getProviders = exports.matchPattern = exports.writeLog = exports.mkRepPath = exports.validateJson = exports.getProviderConfig = exports.getLlmProvider = exports.filterModelObjArr = exports.mkModelListOpts = exports.StructuredSchema = exports.structuredSchema = exports.consoleDir = void 0;
var console_title_1 = __importDefault(require("console-title"));
var zod_1 = require("zod");
// PkLib Imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
// Local Imports
var init_js_1 = require("./init.js");
// Move to common/node lib
function consoleDir(arg, opts) {
    if (opts === void 0) { opts = { depth: null, showHidden: true, colors: true }; }
    console.dir(arg, opts);
}
exports.consoleDir = consoleDir;
/**
 * Create a structured output schema for openai
 * @param name:string
 * @param description:string
 * @param schema - the base zod schema
 */
function structuredSchema(name, description, schema) {
    return zod_1.z.object({
        name: zod_1.z.literal(name),
        description: zod_1.z.literal(description),
        strict: zod_1.z.literal(true),
        schema: schema
    }).strict();
}
exports.structuredSchema = structuredSchema;
/**
 * Build a ZOD schema for structured output & tools for AI endpoints
 */
var StructuredSchema = /** @class */ (function () {
    function StructuredSchema() {
    }
    return StructuredSchema;
}());
exports.StructuredSchema = StructuredSchema;
/**
 * Make options for model list - sort, format, filter
 */
function mkModelListOpts(opts) {
    if (opts === void 0) { opts = {}; }
    var listOptsDef = { sort: 'created', format: true, filter: '' };
    opts = __assign(__assign({}, listOptsDef), opts);
    return opts;
}
exports.mkModelListOpts = mkModelListOpts;
function filterModelObjArr(modelObjs, opts) {
    if (opts === void 0) { opts = {}; }
    var listOptsDef = { sort: 'created', format: true, filter: '' };
    var _a = __assign(__assign({}, listOptsDef), opts), sort = _a.sort, format = _a.format, filter = _a.filter;
    if (filter) {
        var filters_1 = pk_ts_node_lib_1.mkArray(filter);
        modelObjs = modelObjs.filter(function (modelObj) {
            if (modelObj.id) {
                //return modelObj.id.toLowerCase().includes(filter.toLowerCase());
                return pk_ts_node_lib_1.strIncludesAny(modelObj.id, filters_1, true);
            }
            else if (modelObj.name) {
                return pk_ts_node_lib_1.strIncludesAny(modelObj.name, filters_1, true);
                //return modelObj.name.toLowerCase().includes(filter.toLowerCase());
            }
            else { // What to filter on?
                return true;
            }
        });
    }
    if (sort) {
        var sortBy_1;
        if (pk_ts_node_lib_1.isString(sort)) {
            sortBy_1 = sort;
        }
        else {
            sortBy_1 = 'created';
        }
        var cmpFnc = function (a, b) {
            if (a[sortBy_1] === b[sortBy_1]) {
                return 0;
            }
            if (!(a[sortBy_1])) {
                return -1;
            }
            if ((!b[sortBy_1])) {
                return 1;
            }
            return b[sortBy_1] > a[sortBy_1] ? -1 : 1;
        };
        modelObjs.sort(cmpFnc);
    }
    if (format) {
        modelObjs = modelObjs.map(function (modelObj) {
            //let { id, created, } = modelObj;
            if (modelObj.created) {
                modelObj.createdAt = pk_ts_node_lib_1.dtFmt('short', modelObj.created * 1000);
            }
            return modelObj;
        });
    }
    return modelObjs;
}
exports.filterModelObjArr = filterModelObjArr;
/**
 * Return the provider key (lms, ollama)
 * @param {string} provider - ollama' - if null, use llmProvider if set, else ask
 * @returns {string}
 */
function getLlmProvider(provider) {
    if (provider === void 0) { provider = null; }
    if (!provider) {
        provider = askLlmProvider();
    }
    if (provider && Object.keys(init_js_1.providers).includes(provider)) {
        console_title_1["default"](provider);
        return provider;
    }
    else {
        throw new pk_ts_node_lib_1.PkError("No provider found for " + provider);
    }
}
exports.getLlmProvider = getLlmProvider;
function getProviderConfig(provider) {
    if (provider === void 0) { provider = null; }
    provider = getLlmProvider(provider);
    return init_js_1.providers[provider];
}
exports.getProviderConfig = getProviderConfig;
;
function validateJson(data) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    if (!pk_ts_node_lib_1.isSimpleObject(data)) {
        var tod = pk_ts_node_lib_1.typeOf(data);
        throw new pk_ts_node_lib_1.PkError("validateJson - Invalid type [" + tod + "] for 'data':", { data: data });
    }
    var validate = pk_ts_node_lib_1.ajvSchema(init_js_1.fncSchema, { strictSchema: false });
    var valid = validate(data);
    if (!valid) {
        throw new pk_ts_node_lib_1.PkError("Invalid FncSchema data:", { data: data, errors: validate.errors });
    }
    return data;
}
exports.validateJson = validateJson;
function mkRepPath(lbl, ext) {
    if (lbl === void 0) { lbl = 'log-out'; }
    if (ext === void 0) { ext = 'md'; }
    return "./out/" + lbl + "-" + Date.now() + "." + ext;
}
exports.mkRepPath = mkRepPath;
function writeLog(str, _a) {
    var _b = _a === void 0 ? {} : _a, lbl = _b.lbl, ext = _b.ext;
    var lpath = mkRepPath(lbl, ext);
    pk_ts_node_lib_1.writeData(str, lpath);
}
exports.writeLog = writeLog;
//export function matchPattern(str: string, patterns: string[]): boolean {
/**
 * Test if a string matches any of the standard unix GLOB patterns.
 * @param {string} str - The string to test.
 * @param {string|string[]} patterns - An array of standard unix GLOB patterns.
 * @returns {boolean} - True if the string matches any of the patterns, false otherwise.
 */
function matchPattern(str, patterns) {
    var patternArr = pk_ts_node_lib_1.mkArray(patterns);
    var globToRegex = function (glob) {
        var escaped = glob.replace(/[.+^$(){}|[\]\\]/g, '\\$&'); // Escape special regex chars
        var regexStr = "^" + escaped.replace(/\*/g, '.*') + "$"; // Replace `*` with `.*`
        return new RegExp(regexStr);
    };
    return patternArr.some(function (pattern) { return globToRegex(pattern).test(str); });
}
exports.matchPattern = matchPattern;
/** Return providers - array of strings or configs
 * @param {boolean} list - if true, return array of strings, else return object
 */
function getProviders(list) {
    if (list === void 0) { list = true; }
    if (list) {
        return Object.keys(init_js_1.providers);
    }
    return init_js_1.providers;
}
exports.getProviders = getProviders;
/**
 * Takes a msg key or array of msg keys & returns a string of the message keys
 */
function stringifyMsgs(msgs) {
    msgs = pk_ts_node_lib_1.mkArray(msgs);
    if (msgs.length === 1) {
        return msgs[0];
    }
    var msgsStr = "[" + msgs.join('][') + "]";
    return msgsStr;
}
exports.stringifyMsgs = stringifyMsgs;
function askLlmProvider() {
    return __awaiter(this, void 0, void 0, function () {
        var choices, provider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    choices = getProviders();
                    return [4 /*yield*/, pk_ts_node_lib_1.ask('What LLM Provider to use?', { choices: choices })];
                case 1:
                    provider = _a.sent();
                    return [2 /*return*/, provider];
            }
        });
    });
}
exports.askLlmProvider = askLlmProvider;
;
/**
 * Strips opening & closing backticks from text response
 */
function stripBackticks(str, lbl) {
    if (pk_ts_node_lib_1.isEmpty(str)) {
        return str;
    }
    lbl = lbl || 'typescript';
    var cbts = '```';
    var obts = cbts + lbl;
    if (!(str.startsWith(obts))) {
        return str;
    }
    if (!str.endsWith(cbts)) {
        throw new pk_ts_node_lib_1.PkError("stripBackticks - opend with [" + obts + "] but not closed. STR: \n\n" + str + "\n\n");
    }
    str = str.substring(obts.length);
    str = str.substring(0, str.length - cbts.length);
    return str;
}
exports.stripBackticks = stripBackticks;
//# sourceMappingURL=lib.js.map