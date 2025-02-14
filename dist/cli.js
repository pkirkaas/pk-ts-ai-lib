"use strict";
/**
 * CLI Index to run the AI Agents
 * Tests moved to tests.ts
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
exports.__esModule = true;
exports.parseChatArgs = exports.msgKeys = void 0;
// pk-lib imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
// local imports
var init_js_1 = require("./init.js");
// Implementations
exports.msgKeys = {};
function parseChatArgs(args, chatOpts) {
    if (chatOpts === void 0) { chatOpts = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var optDefaults, _a, msgs, opts, umsg;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (typeof chatOpts === 'string') {
                        chatOpts = { provider: chatOpts };
                    }
                    if (!pk_ts_node_lib_1.isSimpleObject(chatOpts)) {
                        throw new pk_ts_node_lib_1.PkError("chatDefaults must be an object");
                    }
                    optDefaults = __assign({ sMsg: 'default', dropSchema: false, forceAsk: false }, chatOpts);
                    _a = pk_ts_node_lib_1.parseArgs(args, optDefaults), msgs = _a.arr, opts = _a.opts;
                    if (opts.provider) {
                        opts.provider = init_js_1.getLlmProvider(opts.provider);
                    }
                    if (!(pk_ts_common_lib_1.isEmpty(msgs) || opts.forceAsk)) return [3 /*break*/, 2];
                    return [4 /*yield*/, pk_ts_node_lib_1.ask("What to ask?")];
                case 1:
                    umsg = _b.sent();
                    msgs.push(umsg);
                    _b.label = 2;
                case 2: return [2 /*return*/, { msgs: msgs, opts: opts }];
            }
        });
    });
}
exports.parseChatArgs = parseChatArgs;
var fncs = {
    tstZod: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var schemas = init_js_1.tstZodSchemas(args);
        console.log({ schemas: schemas });
    },
    tstMsgs: function () {
        init_js_1.tstMsgs();
    },
    askMsg: function () {
        var smsgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            smsgs[_i] = arguments[_i];
        }
        return __awaiter(void 0, void 0, void 0, function () {
            var bMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Ask user msg for sysmsg");
                        return [4 /*yield*/, init_js_1.askMsg(smsgs)];
                    case 1:
                        bMsg = _a.sent();
                        console.log("Built Msg:", { bMsg: bMsg });
                        return [2 /*return*/];
                }
            });
        });
    },
    tstHf: function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, init_js_1.hfChat()];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [2 /*return*/];
            }
        });
    }); },
    tstClient: function (provider) {
        if (provider === void 0) { provider = "openai"; }
        return __awaiter(this, void 0, void 0, function () {
            var client, models;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new init_js_1.OpenAiClient(provider);
                        return [4 /*yield*/, client.filterModels()];
                    case 1:
                        models = _a.sent();
                        console.log({ models: models });
                        return [2 /*return*/];
                }
            });
        });
    },
    tstNewMsg: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, uMsg, sMsg, outPath;
            return __generator(this, function (_b) {
                if (pk_ts_common_lib_1.isEmpty(args)) {
                    args.push('text-popup');
                }
                _a = init_js_1.buildMsg(args), uMsg = _a.uMsg, sMsg = _a.sMsg;
                outPath = pk_ts_node_lib_1.dbgWrt({ what: "tstBuildMsg", args: args, uMsg: uMsg, sMsg: sMsg }, 'buildMsg');
                console.log("Tested buildMsg to [" + outPath + "] with args:", { args: args });
                return [2 /*return*/];
            });
        });
    },
    tstWrapCode: function (key) {
        if (!key) {
            key = "commonlib";
        }
        var srcs = init_js_1.codeFiles[key];
        console.log("CLI: tstWrapCode: " + key + ", srcs:\n", srcs);
        var res = init_js_1.wrapCodeNew(srcs);
        pk_ts_node_lib_1.dbgWrt(res, 'tstWrapCode');
        console.log("\nDone w. tstWrapCode\n");
    }
};
await pk_ts_node_lib_1.runCli(fncs);
console.log('\ndone\n\n');
//# sourceMappingURL=cli.js.map