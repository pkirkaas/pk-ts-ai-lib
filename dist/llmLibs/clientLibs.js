"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.getPkClient = exports.getPkClientClass = exports.clientClasses = exports.TogetherClient = exports.ClaudeClient = exports.OpenAiClient = exports.BaseClient = exports.ChatLogger = exports.defaultSdkChatParams = exports.aiSdkClients = void 0;
var chalk_1 = __importDefault(require("chalk"));
var openai_1 = __importDefault(require("openai"));
var ai_1 = require("ai");
var openai_2 = require("@ai-sdk/openai");
var anthropic_1 = require("@ai-sdk/anthropic");
var togetherai_1 = require("@ai-sdk/togetherai");
var xai_1 = require("@ai-sdk/xai"); //X Grok
//import {Message} from '@anthropic-ai/sdk';
//PkLib Imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
// Local Imports
var init_js_1 = require("../init.js");
exports.aiSdkClients = {
    togetherai: { client: togetherai_1.togetherai, create: togetherai_1.createTogetherAI },
    openai: { client: openai_2.openai, create: openai_2.createOpenAI },
    anthropic: { client: anthropic_1.anthropic, create: anthropic_1.createAnthropic },
    xai: { client: xai_1.xai, create: xai_1.createXai }
};
exports.defaultSdkChatParams = {
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 4096
};
;
/**
 * Log chats - to file and/or DB
 */
var ChatLogger = /** @class */ (function () {
    function ChatLogger(_a) {
        var provider = _a.provider, modelName = _a.modelName, _b = _a.chatConfig, chatConfig = _b === void 0 ? {} : _b, uMsg = _a.uMsg, sMsg = _a.sMsg, _c = _a.msgKeys, msgKeys = _c === void 0 ? [] : _c, _d = _a.outPath, outPath = _d === void 0 ? '' : _d;
        this.followupCnt = 0;
        this.divider = '\n\n# Conversation:\n\n---\n\n';
        this.logInited = false;
        this.provider = provider;
        this.modelName = modelName;
        this.sMsg = sMsg;
        this.uMsg = uMsg;
        this.chatConfig = chatConfig;
        this.stamp = "" + Date.now();
        if (pk_ts_node_lib_1.isEmpty(msgKeys)) {
            msgKeys = uMsg;
        }
        this.msgKeys = pk_ts_node_lib_1.mkArray(msgKeys);
        this.label = this.msgKeys.join('-').substring(0, 25);
        this.chatinfo = "[" + this.label + "::" + this.provider + ":" + this.modelName + "]-" + pk_ts_node_lib_1.dtFmt('dt');
        this.title = this.provider + " - " + this.label;
        var outName = pk_ts_node_lib_1.safeFile(this.label + "--" + this.provider + "-" + this.stamp + ".md");
        this.outPath = outPath || "./out/chats/" + pk_ts_node_lib_1.dtFmt('html') + "/" + pk_ts_node_lib_1.safeFile(this.label) + "/" + outName;
    }
    ChatLogger.prototype.initFile = function (args) {
        if (!this.logInited) {
            pk_ts_node_lib_1.writeData("# " + this.title + "\n\n<title>" + this.title + "</title>\n\n" +
                ("# Chat Session: " + this.chatinfo + "\n\n**chatConfig:**\n```\n" + pk_ts_node_lib_1.JSON5Stringify(this.chatConfig) + "\n```") +
                ("\n\n**Sys Msg:**\n" + this.sMsg + "\n\n**User Msg**:\n" + this.uMsg + "\n\n" + this.divider + "\n\n"), this.outPath);
            this.logInited = true;
            pk_ts_node_lib_1.stdOut(chalk_1["default"].bold("\nLogging [" + this.title + "] chat to: [" + this.outPath + "]\n"));
        }
    };
    /**
     * Write message to log file - type "user" or "assistant"
     */
    ChatLogger.prototype.wrtUsr = function (msg) {
        this.initFile();
        this.followupCnt++;
        pk_ts_node_lib_1.writeData("\n\n---\n\n# Followup to " + this.provider + " " + this.followupCnt + ":\n\n**User:**\n" + msg + "\n\n", this.outPath, true);
    };
    ChatLogger.prototype.wrtAssistant = function (msg) {
        this.initFile();
        pk_ts_node_lib_1.writeData("\n\n**" + this.provider + " Assistant:**\n\n" + msg + "\n", this.outPath, true);
    };
    return ChatLogger;
}());
exports.ChatLogger = ChatLogger;
/**
 * Abstract Client class to provide common interface to different API clients -
 * Base/Default to OpenAI
 * Override for Anthropic, etc
 * New instance for every new interaction, different providers might use the same API client
 */
var BaseClient = /** @class */ (function () {
    function BaseClient(provider) {
        this.provider = init_js_1.getLlmProvider(provider);
        this.createNativeClient();
        //let clientLib = this.providerConfig.clientLib || OpenAI;
    }
    // Constructor actions that can be overridden in subclasses
    BaseClient.prototype.createNativeClient = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a = this.providerConfig, _b = _a.clientLib, clientLib = _b === void 0 ? openai_1["default"] : _b, baseURL = _a.baseURL, apiKey = _a.apiKey;
        this.client = new clientLib({ baseURL: baseURL, apiKey: apiKey });
        return this.client;
    };
    Object.defineProperty(BaseClient.prototype, "sdkClient", {
        get: function () {
            var sdkClient;
            var aisdk = exports.aiSdkClients[this.provider] || exports.aiSdkClients.openai;
            var name = this.provider;
            var _a = this.providerConfig, apiKey = _a.apiKey, baseURL = _a.baseURL;
            if (this.provider === 'openai') { // strict
                var compatibility = 'strict';
                var reasoningEffort = 'high';
                sdkClient = aisdk.create({ apiKey: apiKey, baseURL: baseURL, compatibility: compatibility, reasoningEffort: reasoningEffort, name: name });
            }
            else {
                sdkClient = aisdk.create({ apiKey: apiKey, baseURL: baseURL, name: name });
            }
            return sdkClient;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseClient.prototype, "providerConfig", {
        get: function () {
            return init_js_1.getProviderConfig(this.provider);
        },
        enumerable: false,
        configurable: true
    });
    BaseClient.prototype.nativeChat = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    /**
     * Possibly interactive method to set this.modelName & return the model name, based on provider & params
     * @param filter?:Strings - filters for model names, or one of 'current' , 'default', 'all',
     */
    BaseClient.prototype.getModelName = function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var providerConfig, models, names, modelName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if ((!filter || (filter === 'current')) && this.modelName) {
                            return [2 /*return*/, this.modelName];
                        }
                        providerConfig = this.providerConfig;
                        if (!filter || (filter === 'default')) {
                            this.modelName = (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.model) || (providerConfig === null || providerConfig === void 0 ? void 0 : providerConfig.defaultModel);
                            if (this.modelName) {
                                return [2 /*return*/, this.modelName];
                            }
                        }
                        return [4 /*yield*/, this.filterModels({ filter: filter })];
                    case 1:
                        models = _a.sent();
                        names = this.modelObjsToNames(models);
                        if (!Array.isArray(names) || !names.length) {
                            throw new pk_ts_node_lib_1.PkError("For provider: [" + this.provider + "] no models found for filter:", filter);
                        }
                        if (names.length === 1) {
                            this.modelName = names[0];
                            return [2 /*return*/, this.modelName];
                        }
                        return [4 /*yield*/, pk_ts_node_lib_1.ask("Choose a model for provider [" + this.provider + "]", { choices: names })];
                    case 2:
                        modelName = _a.sent();
                        this.modelName = modelName;
                        return [2 /*return*/, this.modelName];
                }
            });
        });
    };
    /**
     * Array of model objects to string array of model names
     */
    BaseClient.prototype.modelObjsToNames = function (models) {
        var names = models.map(function (model) { return model.name || model.id; });
        return names;
    };
    /**
     * Returns single chat response as object w. keys:
     * text:string - the text response
     * toolCalls
     * toolResults
     * finishReason
     * usage
     * warnings
     * request
     * response
     * steps
     *
     */
    //async singleSdkChat(messages:SdkMessages, modelName:string, sdkChatParams:SdkChatParams = defaultSdkChatParams):Promise<ChatCompletionMessageParam> {
    BaseClient.prototype.singleSdkChat = function (messages, modelName, sdkChatParams) {
        if (sdkChatParams === void 0) { sdkChatParams = exports.defaultSdkChatParams; }
        return __awaiter(this, void 0, void 0, function () {
            var model, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = this.sdkClient(modelName);
                        return [4 /*yield*/, ai_1.generateText(__assign({ messages: messages, model: model }, sdkChatParams))];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    //async sdkChat({user,system,modelName,temperature}) {
    BaseClient.prototype.sdkChat = function (msgs, ASK, filter, sdkChatParams) {
        if (ASK === void 0) { ASK = false; }
        if (sdkChatParams === void 0) { sdkChatParams = exports.defaultSdkChatParams; }
        return __awaiter(this, void 0, void 0, function () {
            var bMsg, msgKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        msgKeys = pk_ts_node_lib_1.mkArray(msgs);
                        if (!ASK) return [3 /*break*/, 2];
                        return [4 /*yield*/, init_js_1.askMsg(msgs)];
                    case 1:
                        //bMsg = await askMsg(msgKeys);
                        bMsg = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        //bMsg = buildMsg(msgKeys);
                        bMsg = init_js_1.buildMsg(msgs);
                        _a.label = 3;
                    case 3: return [2 /*return*/, this.sdkChatBuilt(bMsg, filter, sdkChatParams)];
                }
            });
        });
    };
    BaseClient.prototype.sdkChatBuilt = function (bMsg, filter, sdkChatParams) {
        if (sdkChatParams === void 0) { sdkChatParams = exports.defaultSdkChatParams; }
        return __awaiter(this, void 0, void 0, function () {
            var uMsg, sMsg, providerConfig, modelName, messages, chatConfig, chatLog, response, assistant;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        uMsg = bMsg.uMsg, sMsg = bMsg.sMsg;
                        providerConfig = this.providerConfig;
                        return [4 /*yield*/, this.getModelName(filter)];
                    case 1:
                        modelName = _a.sent();
                        if (!!uMsg) return [3 /*break*/, 3];
                        return [4 /*yield*/, pk_ts_node_lib_1.ask("What to ask [" + this.provider + "]?")];
                    case 2:
                        uMsg = _a.sent();
                        _a.label = 3;
                    case 3:
                        messages = [
                            { role: 'system', content: sMsg },
                            { role: 'user', content: uMsg },
                        ];
                        chatConfig = sdkChatParams;
                        chatLog = new ChatLogger({ provider: this.provider, modelName: this.modelName, chatConfig: chatConfig, uMsg: uMsg, sMsg: sMsg });
                        _a.label = 4;
                    case 4:
                        if (!uMsg) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.singleSdkChat(messages, modelName, sdkChatParams)];
                    case 5:
                        response = _a.sent();
                        assistant = response.text;
                        messages.push({ role: 'assistant', content: assistant });
                        pk_ts_node_lib_1.stdOut(chalk_1["default"].blue("\n\n" + assistant + "\n\n"));
                        chatLog.wrtAssistant(assistant);
                        return [4 /*yield*/, pk_ts_node_lib_1.ask("Followup for " + this.provider + "?")];
                    case 6:
                        uMsg = _a.sent();
                        messages.push({ role: 'user', content: uMsg });
                        chatLog.wrtUsr(uMsg);
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/, messages];
                }
            });
        });
    };
    /**
     * Generate an object from
     */
    //async sdkObject(msgs:Strings, schema:z.ZodType, modelName?:string):Promise<any> {
    BaseClient.prototype.sdkObject = function (msgs, schema, modelName) {
        return __awaiter(this, void 0, void 0, function () {
            var msgKeys, _a, uMsg, sMsg, messages, model, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        msgKeys = pk_ts_node_lib_1.mkArray(msgs);
                        _a = init_js_1.buildMsg(msgKeys), uMsg = _a.uMsg, sMsg = _a.sMsg;
                        messages = [
                            { role: 'system', content: sMsg },
                            { role: 'user', content: uMsg },
                        ];
                        return [4 /*yield*/, this.getModelName(modelName)];
                    case 1:
                        modelName = _b.sent();
                        model = this.sdkClient(modelName);
                        return [4 /*yield*/, ai_1.generateObject({ model: model, schema: schema, messages: messages })];
                    case 2:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Returns the models available for the provider
     */
    BaseClient.prototype.getModels = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var modelObjs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.models.list()];
                    case 1:
                        modelObjs = (_a.sent()).data;
                        return [2 /*return*/, modelObjs];
                }
            });
        });
    };
    BaseClient.prototype.getRawModels = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a, baseURL, apiKey, options, url, modelObjs, resp, respJson, toRespJson;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.providerConfig, baseURL = _a.baseURL, apiKey = _a.apiKey;
                        options = {
                            method: 'GET',
                            headers: {
                                accept: 'application/json'
                            }
                        };
                        url = baseURL + "/models";
                        if (this.provider === 'gengemini') {
                            url = url + "?key=" + apiKey + "&page_size=1000&pageSize=1000";
                        }
                        else {
                            options.headers.Authorization = "Bearer " + apiKey;
                        }
                        modelObjs = [];
                        //let url = `${baseURL}/models?key=${apiKey}`;
                        console.log("About to fetch models for [" + this.provider + "] from:\n     URL: [" + url + "], apiKey: [" + apiKey + "]");
                        return [4 /*yield*/, fetch(url, options)];
                    case 1:
                        resp = _b.sent();
                        return [4 /*yield*/, resp.json()];
                    case 2:
                        respJson = _b.sent();
                        toRespJson = pk_ts_node_lib_1.typeOf(respJson);
                        //console.log(`respJson:`, { toRespJson, respJson });
                        if (Array.isArray(respJson)) {
                            return [2 /*return*/, respJson];
                        }
                        else if (pk_ts_node_lib_1.isSimpleObject(respJson)) {
                            if (('object' in respJson) && ('data' in respJson)) {
                                modelObjs = respJson.data;
                                if (!Array.isArray(modelObjs)) {
                                    throw new pk_ts_node_lib_1.PkError("Invalid 'models' list w keys 'object', 'data' - response from " + url + " - not array", { modelObjs: modelObjs });
                                }
                            }
                            else if ('models' in respJson) {
                                modelObjs = respJson.models;
                            }
                            else {
                                throw new pk_ts_node_lib_1.PkError("Invalid 'models' list response from " + url + " - ", { respJson: respJson });
                            }
                        } // respJson should be array of model def objects - filter, format & sort
                        return [2 /*return*/, modelObjs];
                }
            });
        });
    };
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names, or 'all' or empty for all
     * @param opts.format?:any - format models? - Currently, just format created date
     * @param opts.sort?:string - sort by ModelObject key
     * @param opts.type?:string - filter by ModelObject 'type' key - like 'chat'
     * @return Array of Model Objects
     */
    BaseClient.prototype.filterModels = function (opts) {
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var modelObjs, listOptsDef, _a, sort, format, filter, type, filters_1, sortBy_1, cmpFnc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getModels()];
                    case 1:
                        modelObjs = _b.sent();
                        listOptsDef = { sort: 'created', format: true, filter: '' };
                        _a = __assign(__assign({}, listOptsDef), opts), sort = _a.sort, format = _a.format, filter = _a.filter, type = _a.type;
                        if (filter && filter !== 'all') {
                            filters_1 = pk_ts_node_lib_1.mkArray(filter);
                            modelObjs = modelObjs.filter(function (modelObj) {
                                if (modelObj.id) {
                                    return pk_ts_node_lib_1.strIncludesAny(modelObj.id, filters_1, true);
                                }
                                else if (modelObj.name) {
                                    return pk_ts_node_lib_1.strIncludesAny(modelObj.name, filters_1, true);
                                }
                                else { // What to filter on?
                                    return true;
                                }
                            });
                        }
                        if (sort) {
                            if (pk_ts_node_lib_1.isString(sort)) {
                                sortBy_1 = sort;
                            }
                            else {
                                sortBy_1 = 'created';
                            }
                            cmpFnc = function (a, b) {
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
                                if (modelObj.created) {
                                    modelObj.createdAt = pk_ts_node_lib_1.dtFmt('short', modelObj.created * 1000);
                                }
                                return modelObj;
                            });
                        }
                        if (type) {
                            modelObjs = modelObjs.filter(function (modelObj) { return modelObj.type === type; });
                        }
                        return [2 /*return*/, modelObjs];
                }
            });
        });
    };
    return BaseClient;
}());
exports.BaseClient = BaseClient;
/**
 * The default pk client
 */
var OpenAiClient = /** @class */ (function (_super) {
    __extends(OpenAiClient, _super);
    function OpenAiClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return OpenAiClient;
}(BaseClient));
exports.OpenAiClient = OpenAiClient;
var ClaudeClient = /** @class */ (function (_super) {
    __extends(ClaudeClient, _super);
    function ClaudeClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ClaudeClient;
}(BaseClient));
exports.ClaudeClient = ClaudeClient;
/**
 * Uses OpenAI API client, but custom methods/implementations
 */
var TogetherClient = /** @class */ (function (_super) {
    __extends(TogetherClient, _super);
    function TogetherClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TogetherClient.prototype.getModels = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("In Overridden TogetherClient getModels");
                        return [4 /*yield*/, this.getRawModels.apply(this, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return TogetherClient;
}(BaseClient));
exports.TogetherClient = TogetherClient;
exports.clientClasses = {
    OpenAiClient: OpenAiClient,
    ClaudeClient: ClaudeClient,
    TogetherClient: TogetherClient
};
function getPkClientClass(provider) {
    provider = init_js_1.getLlmProvider(provider);
    var config = init_js_1.getProviderConfig(provider);
    var clientClass = config.pkClientClass || OpenAiClient;
    return clientClass;
}
exports.getPkClientClass = getPkClientClass;
/**
 *
 */
function getPkClient(provider) {
    provider = init_js_1.getLlmProvider(provider);
    var config = init_js_1.getProviderConfig(provider);
    var clientClass = getPkClientClass(provider);
    var client = new clientClass(provider);
    return client;
}
exports.getPkClient = getPkClient;
//# sourceMappingURL=clientLibs.js.map