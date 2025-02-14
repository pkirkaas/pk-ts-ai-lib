"use strict";
/**
 * Building messages for chat
 */
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.usrMessages = exports.systemMessages = exports.defaultSysMsg = exports.codeFiles = exports.buildSysMsg = exports.nestReplaceTags = exports.buildMsg = exports.askMsg = exports.tagReplace = exports.assertMsgType = exports.extractMsgTags = exports.getMsgObj = exports.tstMsgs = exports.wordCnt = exports.wrapKeyType = exports.txtMsgTypes = exports.msgTypes = exports.wrapPairs = exports.stripComments = exports.assertEmbedsType = exports.assertEmbeddeds = void 0;
// NPM Imports
var node_fs_1 = __importDefault(require("node:fs"));
//PkLib imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
// Local Imports
var init_js_1 = require("./init.js");
/**
 * Throws if any embeds remain in string(s)
 */
function assertEmbeddeds() {
    var strs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        strs[_i] = arguments[_i];
    }
    for (var _a = 0, strs_1 = strs; _a < strs_1.length; _a++) {
        var str = strs_1[_a];
        var msgTypes_2 = Object.keys(exports.wrapPairs);
        for (var _b = 0, msgTypes_1 = msgTypes_2; _b < msgTypes_1.length; _b++) {
            var msgType = msgTypes_1[_b];
            var _c = exports.wrapPairs[msgType], open_1 = _c.open, close_1 = _c.close;
            var tags = pk_ts_node_lib_1.taggedMatches(str, open_1, close_1);
            if (tags.length) {
                //TODO! Throw again when fixed!
                //throw new PkError(`Remaining tags in msgStr`, { msgType, tags });
                console.error("Remaining tags in msgStr", { msgType: msgType, tags: tags });
            }
        }
    }
}
exports.assertEmbeddeds = assertEmbeddeds;
/**
 * Throws if any embeds for type msgType remain in string
 */
function assertEmbedsType(msgStr, msgType) {
    assertMsgType(msgType);
    var _a = exports.wrapPairs[msgType], open = _a.open, close = _a.close;
    var tags = pk_ts_node_lib_1.taggedMatches(msgStr, open, close);
    if (tags.length) {
        //TODO! Throw again when fixed!
        //throw new PkError(`Remaining tags in msgStr`, { msgType, tags });
        console.error("In assertEmbedsType: Remaining tags in \n\n" + msgStr + "\n\n of #" + msgType + "#:", { tags: tags });
    }
}
exports.assertEmbedsType = assertEmbedsType;
/**
 * Strip comments from msgStr. Don't love the comment syntax,
 * but for now: `{| This is a comment |}`
 */
function stripComments(msgStr) {
    var cmtRE = /\{\|(.+?)\|\}/gs; //s for multiline
    msgStr = msgStr.replace(cmtRE, '');
    return msgStr;
}
exports.stripComments = stripComments;
exports.wrapPairs = {
    sysmsg: {
        open: '[[',
        close: ']]'
    },
    usrmsg: {
        open: '[<',
        close: '>]'
    },
    code: {
        open: '{{',
        close: '}}'
    },
    comment: {
        open: '{|',
        close: '|}'
    }
};
exports.msgTypes = Object.keys(exports.wrapPairs).filter(function (key) { return key !== 'comment'; });
exports.txtMsgTypes = exports.msgTypes.filter(function (key) { return key !== 'code'; });
function wrapKeyType(key, msgType) {
    assertMsgType(msgType);
    var _a = exports.wrapPairs[msgType], open = _a.open, close = _a.close;
    return "" + open + key + close;
}
exports.wrapKeyType = wrapKeyType;
function wordCnt(str) {
    if (typeof str !== 'string') {
        throw new pk_ts_node_lib_1.PkError("In wordCnt - str is not a string:", { str: str });
    }
    var array = str.trim().split(/\s+/);
    return array.length;
}
exports.wordCnt = wordCnt;
/**
 * Test all the message keys in the system
 */
function tstMsgs(typex) {
    for (var _i = 0, msgTypes_3 = exports.msgTypes; _i < msgTypes_3.length; _i++) {
        var msgType = msgTypes_3[_i];
        //console.log(`In tstMsgs - testing msgType: [${msgType}]`);
        var msgObj = getMsgObj(msgType);
        var msgKeys = Object.keys(msgObj);
        for (var _a = 0, msgKeys_1 = msgKeys; _a < msgKeys_1.length; _a++) {
            var msgKey = msgKeys_1[_a];
            var msgStr = "msgKey: [" + msgKey + "] - type: [" + msgType + "]; wrapped: #" + wrapKeyType(msgKey, msgType) + "# BLOCK";
            //console.log(`Testing key: [${msgKey}] of type: [${msgType}]`);
            try {
                var msgs = buildMsg(msgStr);
            }
            catch (e) {
                var errMsg = e.message;
                console.error("tstMsgs error for [" + msgKey + "], msgStr: ['" + msgStr + "'], msgType:[" + msgType + "]", { e: e });
            }
        }
    }
}
exports.tstMsgs = tstMsgs;
/**
 * Builds a MsgObj for a given msg type - hard coded for now
 * @param msgType:string - 'sysmsg' | 'usrmsg' | 'code'
 * @param msgObj?:MsgObj - object of msg keys & msg strings to add to default
 */
function getMsgObj(msgType, msgObj) {
    if (msgObj === void 0) { msgObj = {}; }
    if (!exports.msgTypes.includes(msgType)) {
        throw new pk_ts_node_lib_1.PkError("in getMsgObj; invalid msgType:", msgType);
    }
    var msgSrcs = [msgObj];
    switch (msgType) {
        case 'sysmsg':
            msgSrcs.push(exports.systemMessages);
            break;
        case 'usrmsg':
            msgSrcs.push(exports.usrMessages, init_js_1.getFileMsgObj());
            break;
        case 'code':
            msgSrcs.push(exports.codeFiles);
            break;
        default:
            throw new pk_ts_node_lib_1.PkError("in getMsgObj; invalid msgType:", msgType);
    }
    if (!pk_ts_node_lib_1.uniqueKeys(msgSrcs)) {
        throw new pk_ts_node_lib_1.PkError("in getMsgObj; duplicate keys in msgSrcs:", msgSrcs);
    }
    var ret = Object.assign.apply(Object, __spreadArrays([{}], msgSrcs));
    return ret;
}
exports.getMsgObj = getMsgObj;
function extractMsgTags(str, msgType) {
    assertMsgType(msgType);
    var _a = exports.wrapPairs[msgType], open = _a.open, close = _a.close;
    var tags = pk_ts_node_lib_1.uniqueVals(pk_ts_node_lib_1.taggedMatches(str, open, close));
    // Test filter for empty tags - where do they come from?
    tags = tags.filter(function (tag) { return (!pk_ts_node_lib_1.isEmpty(tag) || (tag !== "''")); });
    var msgObj = getMsgObj(msgType);
    var msgKeys = Object.keys(msgObj);
    var unfound = pk_ts_node_lib_1.inArr1NinArr2(tags, msgKeys);
    if (unfound.length && (msgType !== 'code')) {
        throw new pk_ts_node_lib_1.PkError("Tags in string of msgType: [" + msgType + "] not found in msg keys:", { unfound: unfound, msgKeys: msgKeys });
    }
    return tags;
}
exports.extractMsgTags = extractMsgTags;
function assertMsgType(msgType) {
    if (!exports.msgTypes.includes(msgType)) {
        throw new pk_ts_node_lib_1.PkError("in expandMsgsNew; invalid msgType:", msgType);
    }
}
exports.assertMsgType = assertMsgType;
function tagReplace(tag, msgType, strip) {
    assertMsgType(msgType);
    var replace = '';
    if (strip) {
        return replace;
    }
    var msgObj = getMsgObj(msgType);
    // TMP - fix for literal code paths
    /*
    if (!(tag in msgObj)) {
        throw new PkError(`Key for tag: [${tag}] not found for msgType: [${msgType}]`);
    }
        */
    var val = msgObj[tag];
    if (!val) { //NEW - Allow actual file paths for code, not just tags
        if (msgType === 'code') {
            val = tag.trim();
            if (!node_fs_1["default"].existsSync(val)) {
                //if (!isFile(val)) {
                throw new pk_ts_node_lib_1.PkError("Code File: [" + val + "] not found for msgType: [" + msgType + "]");
            }
        }
        else {
            throw new pk_ts_node_lib_1.PkError("Value for tag: [" + tag + "] not found for msgType: [" + msgType + "]");
        }
    }
    if (msgType === 'code') {
        replace = init_js_1.wrapCodeNew(val);
    }
    else if ((msgType === 'usrmsg') || (msgType === 'sysmsg')) {
        replace = val;
    }
    else {
        throw new pk_ts_node_lib_1.PkError("Unhandled msgtype [" + msgType + "]");
    }
    return "\n" + replace + "\n";
}
exports.tagReplace = tagReplace;
/**
 * Accept sysMsg keys, ask user for uMsg
 * @return Promise<BuiltMsg>
 */
function askMsg(smsgx) {
    return __awaiter(this, void 0, void 0, function () {
        var smsgs, msgType, smsgStr, smsgObj, smsgKeys, skey, _i, smsgs_1, smsg, sMsg, uMsg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log({ smsgx: smsgx });
                    smsgs = pk_ts_node_lib_1.mkArray(smsgx);
                    msgType = 'sysmsg';
                    smsgStr = '\n';
                    smsgObj = getMsgObj(msgType);
                    smsgKeys = Object.keys(smsgObj);
                    if (!pk_ts_node_lib_1.isEmpty(smsgx)) return [3 /*break*/, 2];
                    return [4 /*yield*/, pk_ts_node_lib_1.ask("What sys msg?", smsgKeys)];
                case 1:
                    skey = _a.sent();
                    if (!smsgKeys.includes(skey)) {
                        throw new pk_ts_node_lib_1.PkError("skey [" + skey + "] not found in sMsg keys");
                    }
                    smsgs = [skey];
                    _a.label = 2;
                case 2:
                    for (_i = 0, smsgs_1 = smsgs; _i < smsgs_1.length; _i++) {
                        smsg = smsgs_1[_i];
                        if (wordCnt(smsg) > 1) { // Literal message string
                            smsgStr += smsg + "\n";
                        }
                        else if (smsgKeys.includes(smsg)) {
                            smsgStr += wrapKeyType(smsg, msgType);
                        }
                        else {
                            throw new pk_ts_node_lib_1.PkError("in askMsg - msg [" + smsg + "] not in smsgKeys");
                        }
                    } // We have a tagged umessage string, with uMsg, sMsg, code & comment tags
                    sMsg = nestReplaceTags(buildSysMsg(smsgStr), 'code').trim() || exports.defaultSysMsg;
                    return [4 /*yield*/, pk_ts_node_lib_1.ask("Ask:")];
                case 3:
                    uMsg = _a.sent();
                    return [2 /*return*/, { sMsg: sMsg, uMsg: uMsg }];
            }
        });
    });
}
exports.askMsg = askMsg;
/**
 * Takes msgx:Strings & returns BuiltMsg with uMsg & sMsg, with all substitutions
 * @param msgx:Strings - String or string[] Array of msgs or msg keys
 */
function buildMsg(msgx) {
    var msgs = pk_ts_node_lib_1.mkArray(msgx);
    var msgType = 'usrmsg';
    var msgStr = '\n';
    var umsgObj = getMsgObj(msgType);
    var umsgKeys = Object.keys(umsgObj);
    for (var _i = 0, msgs_1 = msgs; _i < msgs_1.length; _i++) {
        var msg = msgs_1[_i];
        if (wordCnt(msg) > 1) { // Literal message string
            msgStr += msg + "\n";
        }
        else if (umsgKeys.includes(msg)) {
            msgStr += wrapKeyType(msg, msgType);
        }
        else {
            throw new pk_ts_node_lib_1.PkError("in buildMsg - msg [" + msg + "] not in umsgKeys");
        }
    } // We have a tagged umessage string, with uMsg, sMsg, code & comment tags
    // Substitute uMsg tags w. expansions
    var usrMsg = nestReplaceTags(msgStr, msgType);
    var sMsg = nestReplaceTags(buildSysMsg(usrMsg), 'code').trim() || exports.defaultSysMsg;
    var uMsg = nestReplaceTags(nestReplaceTags(usrMsg, 'sysmsg', true), 'code');
    // If special force ask key, 
    //assertEmbeddeds(uMsg, sMsg);
    return { uMsg: uMsg, sMsg: sMsg };
}
exports.buildMsg = buildMsg;
function nestReplaceTags(msgStr, msgType, strip) {
    assertMsgType(msgType);
    msgStr = stripComments(msgStr);
    var depth = 0;
    var depthLimit = 10;
    var msgTags = extractMsgTags(msgStr, msgType);
    var usedTags = [];
    while (msgTags.length) {
        if (depth++ > depthLimit) {
            throw new pk_ts_node_lib_1.PkError("Depth Exceeded:", { msgStr: msgStr, msgType: msgType, msgTags: msgTags });
        }
        for (var _i = 0, msgTags_1 = msgTags; _i < msgTags_1.length; _i++) {
            var tag = msgTags_1[_i];
            var wrapped = wrapKeyType(tag, msgType);
            var rep = tagReplace(tag, msgType, strip);
            if (usedTags.includes(tag)) {
                rep = tagReplace(tag, msgType, true);
            }
            else {
                usedTags.push(tag);
            }
            msgStr = msgStr.replaceAll(wrapped, rep);
        }
        msgTags = extractMsgTags(msgStr, msgType);
    }
    var stripped = stripComments(msgStr);
    assertEmbedsType(stripped, msgType);
    return stripped;
}
exports.nestReplaceTags = nestReplaceTags;
function buildSysMsg(msg) {
    var msgType = 'sysmsg';
    var sysTags = extractMsgTags(msg, msgType);
    var sysMsgStr = '';
    for (var _i = 0, sysTags_1 = sysTags; _i < sysTags_1.length; _i++) {
        var sysTag = sysTags_1[_i];
        sysMsgStr += wrapKeyType(sysTag, msgType);
    }
    sysMsgStr = nestReplaceTags(sysMsgStr, msgType);
    return sysMsgStr;
}
exports.buildSysMsg = buildSysMsg;
/**
 * Keys w. source code file path, to be wrapped in triple backticks
 */
exports.codeFiles = {
    fsb: 'Q:/Common/Software-Dev/Pythons/similar-images/src/file-system-browser.py',
    fncSchema: './src/FncSchemas/fnc2schema.json',
    /*
    ssrSrc: {
      fpaths: "C:/www/NodeTests/NextTests/ssr/next-ssr-demo",
      desc: 'Next.js SSR Demo',
    },
    */
    nextconfs: {
        fpaths: [
            "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json",
            "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.cli.json",
            "Q:/Common/AI-Experiments/Node/guis/next-basic/next.config.ts",
            "Q:/Common/AI-Experiments/Node/guis/next-basic/package.json",
        ],
        desc: 'Next.js Basic Configurations'
    },
    commonlib: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Common",
        root: "C:/www/TypeScriptLibs/Pk-Ts-Common",
        excPatterns: [".md", ".sh", "tstcli",],
        debug: true,
        desc: 'Common TypeScript/JavaScript Library Sources and Configuration Files:'
    },
    commonops: { fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Common/src/common-operations.ts" },
    cssmodules: [{
            desc: "The library `tsconfig.json`",
            fpaths: "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json"
        }, {
            desc: "The library `tsconfig.json`",
            fpaths: "Q:/Common/AI-Experiments/Node/guis/next-basic/tsconfig.json"
        }
    ],
    fetsconfig: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/tsconfig.json",
        desc: "The TypeScript config file for the FE library `tsconfig.json`"
    },
    fepackage: {
        fpaths: 'C:/www/TypeScriptLibs/Pk-Ts-Fe/package.json',
        desc: "The npm package file for the FE library"
    },
    daisynav: {
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/daisynav.tsx",
        desc: "Example of responsive DaisyUI navigation bar"
    },
    pknav: {
        //fpaths:"C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/anavbar.tsx",
        fpaths: "C:/www/TypeScriptLibs/Pk-Ts-Fe/src/components/daisyui/antnav2.tsx",
        desc: "Attempt at a responsive, reusable navigation bar"
    },
    pkfelib: {
        desc: "The configuration files for the `pk-ts-fe-lib` library:",
        fpaths: [
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/tailwind.config.ts",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/vite.config.ts",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/postcss.config.js",
            "C:/www/TypeScriptLibs/Pk-Ts-Fe/package.json",
        ]
    },
    mynextapp: {
        desc: "The configuration files for the `my-next-app`, which imports the `pk-ts-fe-lib` library:",
        fpaths: [
            "C:/www/NodeTests/NextTests/ssr/next-2/tailwind.config.ts",
            "C:/www/NodeTests/NextTests/ssr/next-2/next.config.ts",
            "C:/www/NodeTests/NextTests/ssr/next-2/package.json",
            "C:/www/NodeTests/NextTests/ssr/next-2/postcss.config.mjs",
        ]
    },
    fncSchema2: "Q:/Common/AI-Experiments/Node/AI-TS-Lib/src/FncSchemas/fnc2schema.json",
    /*
  "C:/www/NodeTests/NextTests/ssr/next-2/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js"
    */
    nmnav: {
        desc: "The generated/compiled file containing the `PkNavbar` component, built in configuration files for the `pk-ts-fe-lib` library but installed in the `my-next-app` project in `my-next-app/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js`",
        fpaths: "C:/www/NodeTests/NextTests/ssr/next-2/node_modules/pk-ts-fe-lib/dist/esm/components/daisyui/antnav2.js"
    }
};
//You are a highly specialized AI assistant focused on accurate software code generation. Provide exact, correct code snippets and minimize unnecessary explanations. Only answer when completely certain.
exports.defaultSysMsg = "You are a highly specialized AI Advanced Software Engineering and Development assistant, focused on accurate software code analysis and generation. You are an expert in software design, engineering and development, particularly with `Python`, advanced `JavaScript` and `TypeScript`, assuming the very latest versions of all tools and languages. Compatibility with older versions of any software languages, environments or packages is not required.\n\nFor all proposed third party libraries and packages, you will also provide the 'bash' commands to install them via appropriate package managers - `pip` or `npm`.\n\nYour audience is highly skilled software developers and engineers who require technical, detailed implementable solutions.\n\nYour response is not chatty or friendly, but neither is it just high level conceptual overview.\n\nYou consider your answer in depth, carefully, reason through step by step. You will provide a very detailed, thorough, complete, correct response, prioritizing correctness over speed, and provide runnable code necessary to implement the requested functionality.\n\nAll the code examples you provide are intended for development/experimentation and Proofs of Concept - **NOT** production use. Performance and efficiency are not important. Simplicity and clarity are very important. Prefer simplicity over efficiency, clarity over efficiency, and synchronous code over asynchronous code. All the code examples you provide should be wrapped in ```triple backticks``` with the appropriate language modifiers to indicate that it is code.\n\nFurthermore, your code examples should also indicate the filename/path of the file in which the code should be placed.\n\nYou will ask clarifying questions if you need more information for your answer - it is much better to say you don't know than provide possibly incorrect information. Accuracy is essential.\n\nBefore you respond, you will review your solution again, and PLEASE, PLEASE take the extra time to double check and ensure legal code & error free code.\n\n";
exports.systemMessages = {
    tstdef: "test default sys",
    tstnest: "[[tstdef]]\n  {{commonlib}}\n  Tst Nest after tstdef inc\n  ",
    "default": exports.defaultSysMsg,
    code: "[[default]] \nThe context is a new software application in very early stages of development and prototyping. Therefore, backward compatibility is not a concern. Production optimization or deployment is not a concern. Performance is not a concern. Legacy code or package support is not a concern. We want to make use of the latest features of all libraries and packages, including beta versions and release candidates. Stability of library packages is not a concern. \n\nSimplicity and clarity and ease of developer effort are very important. Prefer simplicity over complexity and efficiency, clarity over efficiency, and synchronous code over asynchronous code.\n\n  \nResponse Requirements:\n1. Provide complete, implementable solutions with runnable code\n2. Include all necessary imports and setup\n3. Specify file paths and structure\n4. Include package installation commands (pip/npm)\n5. Focus on clarity and correctness over optimization\n6. Assume audience is experienced software engineers\n7. Provide step-by-step technical explanations when needed\n8. Ask clarifying questions if requirements are unclear\n\nCode Requirements:\n1. All code must be wrapped in language-specific triple backticks\n2. Include file paths/names for all code blocks\n3. Provide complete, self-contained solutions\n4. Focus on readability over performance\n5. Include error handling for critical operations\n6. Add explanatory, technical comments throughout the code\n7. Consider & handle all possible edge cases\n8. Add complete documentation for each code module (function/class/etc) in the language appropriate doc comment format for the language ('tsdoc' for 'typescript', 'pydoc' for 'python', etc.), including purpose, usage, parameter specification, return, etc.\n\nDo not:\n1. Include unnecessary conversation or pleasantries\n2. Provide partial or conceptual-only solutions\n3. Skip error handling in critical code\n4. Make assumptions about unclear requirements\n  ",
    python: "[[code]] You are an expert in modern Python (v >= 3.10) software development and engineering. You are an expert in the latest versions of all python  libraries, packages, frameworks and tools. \n\n  For all Python code examples you provide, ensure you provide the `bash` command to install the required Python packages, and the `pip` command to install the required Python packages.\n  ",
    ai: "[[default]] You also have advanced expertise in developing custom AI agents and assistants written in Python and TypeScript/JavaScript, using multiple LLMs, running locally or through cloud based APIs (`Open AI API`, etc), including tuning LLM configuration parameters like `temperature`, `topP`, etc. You specialize in advanced RAG Training and Fine Tuning of models for adding specialized expertise to custom LLMs.\n\n  Additionally, you are deeply familiar with all the latest AI frameworks and tools, including `LangChain`, `LlamaIndex`, `LangGraph`, `GPT4All`, `Llama.cpp`, etc., for both Python and JavaScript/TypeScript, used to develop custom AI agents and assistants, and to fine tune and train custom LLMs, as well as free/open source vector storage databases, etc.\n  ",
    aiclient: "[[ts]] [[ai]] You are an expert in the latest npm/node AI API client libraries, including the Vercel `ai-sdk` core and client libraries, as well as the `openai`, `@anthropic-ai/sdk`, etc client libraries.\n\nYou are an expert with the latest versions (4.1)  of the NPM AI SDK client libraries by `Vercel` - https://sdk.vercel.ai/ -\n  \n  You have particular expertise in creating AI API requests for structured data, RAG training, etc.\n  ",
    pyapp: "[[pyqt]] The goal is to create portable Python windowed/GUI applications that can be run on any Windows, macOS, or Linux system, using  the latest version of the `PyQt` library to create the portable GUI for the application. \n\n  To localize python dependencies, we use python virtual environments and the latest versions of the `pdm` python package manager.\n  \n  The applications will be very modular, consisting of a main application window, with a menu bar, a status bar, etc, and multiple reusable widget modules, each with a separate python file, which can be used in multiple applications, and can return data to the main application and other modules. \n\n  In all cases, particularly the main application window, whenever a widget/component contains multiple sub-widgets/components, the main widget will be a container widget, and the sub-widgets will be added to the main widget as child widgets. The container widgets will implement vertical and horizontal layouts and resizing handles.\n\n  For example, there will be a file system browser module/widget which allows the user to browse the file system, and select files and directories, and return the selected files and directories to the main application.\n\n  The results of the file selection widget/browser might be returned to the main application as a list of file path strings, which might then use the selected files to load into a multi-image-viewer widget that displays the selected image files in a grid, and allows the user to select an image to view in a separate window.\n\n  The applications are all undergoing active development and debugging. During development, the applications will be run from the command line, and the output of the application will be displayed in a separate window. All actions will be logged to a log file and the terminal.\n\n  ",
    llmgoals: "[[aicodetrain]] The LLM trained on the custom code should have a deep understanding of the behavior and purpose of each function in the codebase. This can be challenging because many functions accept arguments of different types, and the behavior and return values of the functions can vary depending on the type of the arguments, so it is important to understand the behavior of the functions in the context of the codebase.\n\n  The result of the custom trained LLM should be able to act as a powerful coding assistant for the specialized code base, and for general coding. Among other requirements, the trained LLM should be able to interact with the developer in the Development Environment (VS Code), monitor the developers code, and suggest  and the Terminal, and be able to perform the following tasks:\n  \n  support the following for the custom code base:\n   - the purpose and effect of each function & class\n   - Deep understanding of \n\n  ",
    aicodetrainbase: "[[ai]] The goal is to further train a pre-trained coding LLM ('gpt-4o', 'llama-3.2', etc) on custom code bases/libraries, to enable the LLM to act as a coding assistant for the specialized code base as well as for general coding.\n\n  The code base libraries are implemented in TypeScript/JavaScript, to provide specialized functionality for multiple applications. \n\n  The libraries each focus on a specific area of functionality, such as front-end/browser components, back-end NodeJS server support, specialized Database/SQL support, etc, and often an application will include several of these libraries in the same application.\n\n  The custom training will focus initially on one of the libraries, but when the training is successful, it should be expanded to include the other libraries, without loss of the initial training results.\n\n  The trained LLM should be able to act as a powerful coding assistant for the specialized code base, and for general coding. Among other requirements, the trained LLM should be able to interact with the developer in the Development Environment (VS Code) to monitor the developers code, identify errors, suggest code completion and generation based on the custom libraries. \n\n  It should also be aware of the function parameters, types, and return values of the functions, and identify potential parameter errors and suggest fixes.\n\n  It should also be able to work as an AI coding chatbot in a terminal, to allow the developer to ask the chatbot for suggestions on how to achieve a coding goal, and the chatbot should be able to generate appropriate code, using the features and functionality of the custom code libraries it has been trained on.\n  \n  The trained LLM should also be able to identify potential errors/problems in the original code base libraries and suggest improvements/enhancements, error handling, and refactoring, as well as generate complete documentation for each of the functions, classes, and modules in the codebase, support overloaded function and method signatures, etc.\n\nThis will be a long term, multi-step process, with multiple steps, and multiple iterations of training, and multiple iterations of testing and evaluation.\n",
    tsmorph: "[[ts]] You are deeply familiar with the npm TypeScript parsing package `ts-morph`\n",
    aicodetrain: "[[aicodetrainbase]]\nThe first step is to prepare the source code and extract the relevant information from the code in a suitable structure to support the requirements.\n  \nOur initial approach is to define a JSON schema to explicitly define all the metadata required for each function of the codebase, and then use the JSON schema to extract the relevant information from the code.\n\n{|\n  and be able to answer multiple coding questions with follow-up questions, which can be used as assistants for general coding.\n\n  The custom codebases/libraries are imported and used in multiple different projects in a variety of ways.  so it is important to understand the behavior of the functions in the context of the codebase.\n\n  The training methods can be 'RAG' (Retrieval Augmented Generation) or 'Fine Tuning' (Fine Tuning), a combination of both, or other approaches you suggest.\n\n\n  I already have implemented multiple multi-shot chatbot agents/applications in both Python and JavaScript, using the OpenAI API, Anthropic API, and Google Vertex which I can run from a command line terminal, which can answer multiple coding questions with follow-up questions, which can be used as assistants for general coding.\n\n  The challenge is to implement custom code training on custom code bases. The software languages can be restricted to 'python', 'javascript' & 'typescript'. That requires several steps and additional libraries and utilities. \n  \n  I have a local vector database/store installed - 'ChromaDB' - but I am open to other open source vector stores that can run locally - 'FAISS', 'Weaviate', or others. I am not interested in cloud or managed vector DBs. I also have several large code bases to train on.\n\n  The code bases need to be prepared, split into smaller chunks, and the metadata for each function needs to be extracted and stored in a vector database.\n|}\n  ",
    tscodetrain: "[[aicodetrain]] The first The first step is to analyze the code base, and split it into smaller chunks, and extract the metadata for each function, and store the metadata in a vector database.\n  ",
    js: "[[code]] You are an expert in advanced techniques with modern JavaScript ('ES2022' and greater) software development and engineering, using the `npm` package management system, advanced configuration with `package.json`, and all relevant, latest versions of 'npm' packages. \n  \n  All your code suggestions should use the modern  `ESM` `import` module syntax  over `CommonJS` `require` module syntax.\n  \n  For all `npm` packages you suggest, use the latest versions and include the `npm install` command for the packages in your responses.\n  ",
    ts: "[[js]] You are an expert in advanced techniques with modern TypeScript (version >= 5.6) software development and engineering, including advanced typescript build configurations and options with `tsconfig.json`.\n  ",
    node: "[[ts]] You are an expert in configuration, operation, options for the latest Node.js (version >= 23) development and engineering, and all relevant, latest versions of `npm` packages.\n  ",
    sql: "[[code]] You are an expert in advanced techniques with modern SQL design, queries, best practices, indexing, etc. You have particular expertise in PostgreSQL (version >= 16) and SQLite (version >= 3.44).\n",
    typeorm: "[[sql]] [[node]] You are an expert with the `TypeORM` ORM Library (version >= 0.3.20) with SQLite and PostgreSQL, particularly with Entity definitions, including advanced column and relationship definitions, and advanced queries, including joins, subqueries, and advanced joins. We exlusively use the `Active Record` pattern for TypeORM, all Entities extend the `BaseEntity` class.\n",
    zod: "[[node]]\nYou are an expert with the latest version of the npm TypeScript first schema/typing package `zod`\n",
    vscode: "[[node]] You are an expert in configuration and usage of the latest `VSCode` Software development IDE (v >= 1.9), as well as all extensions ",
    aiprep: "[[ai]] I have prepared the data for my 100 TypeScript functions by extracting metadata about each function in JSON format. The metadata for each function is in the format specified by the `json-schema` that follows below. ",
    embedding: "The next step is to generate embeddings from this metadata. I know there are multiple ways to generate embeddings, including Hugging Face Transformers, models like CodeBERT, etc, and GNNs, etc.\n\n Your task is to consider all practical approaches to generating the embeddings from the structured `json` data according to the schema, evaluate pros and cons of each approach, and provide TypeScript code examples for each.\n ",
    pyqt: "[[python]] You are an expert with the `PyQt6` Python library for creating graphical user interfaces (GUIs), and all available widget libraries.\n\nYou will provide a complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.\n\n ",
    win: "[[default]] You are and expert in the latest version of the 'Microsoft Windows 11 Professional' operating system, with particular expertise in advanced configuration, operation, registry settings, etc.\n ",
    linux: "You are an expert in the latest versions of the Linux operating system, particularly `Ubuntu 24.04` and newer, and the Bash shell scripting, configuration, etc.",
    wsl: "[[win]] [[linux]] You have particular expertise with running and configuring MS `wsl` on Windows\n ",
    tsfnc: "I know the code should be prepared and commented and chunked, etc, but I don't want to do that myself - I want to use AI to do it all for me. I already have written a Chat application in TypeScript using the OpenAI API Node / TypeScript client, and I have a vector database installed on my local development machine.\n  ",
    pureJson: "\n  Your response should be pure `JSON`, without any markdown tags or additional text or comments. It will be automatically inserted into a database, therefore it is essential it is pure, unadorned `JSON`.\n\nYour `JSON` response must comply with the `JSON Schema` provided, or a `JSON` array of objects, each complying with the schema. Note that the `JavaScript` value `undefined` is NOT valid `JSON`. Wherever you use `undefined` as a `JSON` value, use `null` instead. If the `schema` specifies/requires a `type` - like `string` - and you don't have relevant data/value, please try to generate the appropriate value. If you can't generate an appropriate value, use an empty value of the appropriate type rather than null - for example, for a `string` type, use the empty string `\"\"`, for an object type, use `{}`, rather than null. **ENSURE** when the schema requires one of a set of `enum` values, you supply a valid `enum` value.\n\n  ",
    tsanalyze: "[[ts]] You have particular expertise analyzing, developing, understanding and documenting TypeScript/JavaScript on a deep level. Your analysis of the code will focus on how to parse and extract relevant elements of the code for use with LLM RAG training & generating useful embeddings.",
    auto: 'Your response will be automatically inserted into a database. Therefore, your response should not include any chat comments - only the output specified. Do **NOT** wrap your response with triple backticks. DO NOT wrap the TypeScript function body code with "```typescript...```". Only the plain text of your response and nothing else.',
    // Define a TS Function body */
    tsfncbody: "Below follows TypeScript sourcecode containing about 100 export definitions, including TypeScript functions.  \n  \n  For the purpose of this task, a function definition includes any TypeScript comments in `TsDoc` format (`/** ... */`) (if any) which immediately precedes the the function signature, the function signature/call, and the function body/code block, including the opening and closing braces. Remember to consider/include any relevant TypeScript comments that immediately precede the function definition which might include context and understanding of the function.\n  ",
    webapp: "[[typeorm]] [[react]] The project is a full-stack web application with a front-end built with the latest 'React' 19 and a back-end built with NodeJS and 'express'. The backend API database is `sqlite`, using the TypeScript `typeorm` ORM library.\n\n  The project is in very early stages of development and prototyping. \n  ",
    webappauth: "[[webapp]]The application supports user creation/registration, login, authentication and authorization by email/password or third party auth providers such as Google, Facebook, etc.\n  ",
    nextssr: "[[webapp]] \n  We use the latest `nextjs` framework (version >= 15), with the NextJS `App Router` for server-side-rendering (SSR), using the latest React 19 features to use `React Server Components` and `React Server Actions` to reduce development time and complexity by allowing the SSR components to initialize data directly from the server services without the need for client-side API data fetching. We use the latest `tailwindcss` version > 3.4, as well as `daisyui` & `react-daisyui` for UI components.\n  \n\n  You are an expert with the `NextJS` framework, particularly with configuration (`next.config.ts`), including `webpack` configuration, the `App Router` and `React Server Components` and `React Server Actions`.\n\n  ",
    tailwind: "[[react]] You are an expert with the latest `tailwindcss` (version >= 3.4.17) framework, particularly with configuration (`tailwind.config.js`), including `webpack` configuration, the `App Router` and `React Server Components` and `React Server Actions`. You are an expert with the `daisyui` & `react-daisyui` UI component libraries and the `tailwindcss` plugins.\n  ",
    react: "[[ts]]  You have particular expertise in the latest features of the new React version (>= 19) for SSR, particularly `React Server Components` and `React Server Actions`,  using the latest `NesxJS` version >= 15,  as well as all the latest react npm libraries.",
    rcomp: "[[react]] Your task is to create a reusable, configurable, customizable React component as described below. Use existing React libraries and components as building blocks where appropriate, again focusing on simplicity and ease of use/implementation for a single developer. Bundle size is NOT a concern. Minimizing the number of lines of custom code/implementation IS a priority.\n\n  Use the latest features of the new React version (>= 19), in a NextJS application, taking advantage of the latest NextJS framework for SSR & RSC, particularly `React Server Components` and `React Server Actions`.\n  \n  Prefer using `React Server Components` and `React Server Actions` for server-side rendering and data fetching, but you can use Client Components if necessary.\n\n  Also use stable, maintained and well-documented React libraries and components in your solution where appropriate to  avoid reinventing the wheel.\n\n  Take extra effort to ensure that your solution is well-documented, well-tested, and easy to use.\n  ",
    reactcss: "[[react]] [[tailwind]] There are many advanced techniques and libraries for styling React components, including `styled-components`, `emotion`, `css-modules`, `css-in-js` libraries, etc. You are an expert with all of these libraries and techniques, including the latest advanced 'CSS' features, 'SASS' & 'SCSS', 'postcss', 'tailwindcss', etc.\n\n  You have expertise with the latest component libraries for React, including `DaisyUI`, `react-daisyui`, `react-bootstrap`, etc. \n  ",
    vite: "[[reactcss]] You are an expert in the latest version of the `Vite` build tool, including all the latest features and configuration options.",
    reactemotion: "[[reactcss]] You are an expert in the latest versions of all the `emotion` family of npm styling libraries including:\n- \"@emotion/css\"\n- \"@emotion/react\"\n- \"@emotion/styled\"\n- \"@mui/icons-material\"\n- \"@mui/material\"\n- \"@mui/system\"\n  \nThey are very powerful and feature rich, but offer different features and capabilities, and furthermore can be very confusing particularly as different packages export functions with the same name but very different behaviors, such as `css` and `styled`. Your are expert in all of them, and can provide detailed guidance on which to use in different situations, particularly disambiguating between exports with the same name but different behaviors.\n",
    pqt: "[[python]] You are an expert with the `PyQt6` Python library for creating graphical user interfaces (GUIs), and available widget libraries.\n\n  You will provide a complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.",
    aicodeprep: "The code needs to be prepared and commented and chunked, etc, but I don't want to do that myself - I want to use AI to do it all for me. I know this will require several steps and additional libraries and utilities. I also know that different LLMs are more suitable for code preparation/chunking/etc than the LLMs that I want to use for the actual coding assistant.\n  ",
    aicp1: "[[aicodeprep]] Please provide a detailed guide on how to prepare the code for use with an LLM, using another AI LLM, including the steps and tools required, with recommendations and alternatives.\n  "
};
exports.usrMessages = {
    wrappedschema: "\nThis is the `JSON schema` describing the `JSON` meta data of TypeScript functions, to use to generate Code embeddings for use with RAG training. You must take time, and do a complete, thorough, in-depth job, and focus on correctness. It is essential that your response includes all information possible, as much information as possible, that would support its use for RAG training of an LLM to provide all the information required to enable it as an AI Coding Assistant for the functions. The json schema:\n\n{{fncSchema2}}\n",
    pqtBrowser: "[[pqt]]  The sample project should be a simple file system browser, with a tree view of the file system and some way to select multiple files and directories.\n  ",
    embeddings: "[[ai]] [[aiprep]] [[embedding]]  <[wrappedSchemaStr]>",
    aicp2: "[[aicp1]]\n  Let's take one language code base at a time - for now, 'typescript'. I have several large libraries of 'typescript' functions/utilities, as well as many applications that use the libraries. Should I separate the processing of the  the code libraries that implement the library components from the source code of the applications that use the libraries?\n  ",
    pqtAppFramework: "[[pqt]]  The sample project is a runnable windowed application with a top menu bar, containing 3 menu items - 'file', 'help', and 'about'.\n  \n The 'file' menu should have 3 sub-menu items - 'open', 'save', and 'save as'.\n\n Selecting the 'open' menu item should open a file dialog to select a file to open. The 'save' and 'save as' menu items should open a file dialog to select a file to save to.\n\n The 'help' menu item should open a component that only says \"This is the help component\", and contains a \"close\" button.\n \n The 'about' menu item should open a component that only says \"This is the about component\", and includes a \"close\" button.\n \n Create the appropriate components for each described.\n\n Your response should include the complete, working, and tested PyQt6 GUI application in Python code - including all necessary imports and setup code - to create a working GUI application, using standard widgets and layouts where available.\n  ",
    aiapiparams: "[[ai]] I am using the OpenAI API chat completions endpoint to generate and answer questions about software code (`python`, `typescript`, `javascript', etc). I want the responses to be as accurate as possible. Aside from the system and user messages, there are multiple other parameters for the chat completions endpoint - `temperature', `top_p`, `frequency_penalty`, `presence_penalty`, etc.\n\n  Please recommend the best values for the parameters for the chat completions endpoint to generate the most accurate responses to questions about software code, and provide a brief explanation of why you recommend those values.\n  ",
    rag: "[[ai]]",
    tsrag: "[[ai]]",
    tsdecls: "Below follows TypeScript sourcecode containing multiple exports.  Please provide a JSON array of objects for every export. Each object should have only the following properties: 'type' & 'name'. If the type is a class, provide the class name as the 'name'. If the type is a function, provide the function name as the 'name'. If the type is a variable, provide the variable name as the 'name'. If the type is an interface, provide the interface name as the 'name'. If the type is an enum, provide the enum name as the 'name'. If the type is a type alias, provide the type alias name as the 'name'. If the type is a union type, provide the union type name as the 'name'. If the type is a tuple type, provide the tuple type name as the 'name'.\n\n  Only that & nothing more. Wrap the JSON array in triple backticks with followed by 'json' indicating the type of the content.\n\n  ",
    utsfncbody: "Your task is to extract and return the function definition for the function named below. Remember to include any relevant TypeScript comments that immediately precede the function definition which might include context and understanding of the function. Your response should consist ONLY OF TypeScript code wrapped by triple backticks for TypeScript. Only that and nothing more."
};
//# sourceMappingURL=msgs.js.map