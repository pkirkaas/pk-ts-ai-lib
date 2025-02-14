"use strict";
/** Lib for OpenAI API compliant basic local chatbot w. llm-studio  & ollama
 *
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.parseChatRes = exports.getModelByName = exports.getOaiClient = exports.getRawModelObjs = void 0;
// NPM Imports
var openai_1 = __importDefault(require("openai"));
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
// Local Imports
var init_js_1 = require("./init.js");
/**
 * Some providers work better with a direct call to the OpenAI API than
 * using the openai cliient
 * Annoyingly, switch on 'provider' to get right call - currently,
 * gengemini & togetherai
 */
function getRawModelObjs(provider, opts) {
    if (provider === void 0) { provider = 'togetherai'; }
    if (opts === void 0) { opts = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var _a, baseURL, apiKey, options, url, modelObjs, resp, respJson;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    provider = init_js_1.getLlmProvider(provider);
                    _a = init_js_1.getProviderConfig(provider), baseURL = _a.baseURL, apiKey = _a.apiKey;
                    options = {
                        method: 'GET',
                        headers: {
                            accept: 'application/json'
                        }
                    };
                    url = baseURL + "/models";
                    if (provider === 'gengemini') {
                        url = url + "?key=" + apiKey + "&page_size=1000&pageSize=1000";
                    }
                    else {
                        options.headers.Authorization = "Bearer " + apiKey;
                    }
                    modelObjs = [];
                    //let url = `${baseURL}/models?key=${apiKey}`;
                    console.log("About to fetch models for [" + provider + "] from:\n     URL: [" + url + "], apiKey: [" + apiKey + "] & opts:", opts);
                    return [4 /*yield*/, fetch(url, options)];
                case 1:
                    resp = _b.sent();
                    return [4 /*yield*/, resp.json()];
                case 2:
                    respJson = _b.sent();
                    if (Array.isArray(respJson)) {
                        return [2 /*return*/, respJson];
                    }
                    else if (pk_ts_common_lib_1.isSimpleObject(respJson)) {
                        if (('object' in respJson) && ('data' in respJson)) {
                            modelObjs = respJson.data;
                            if (!Array.isArray(modelObjs)) {
                                throw new pk_ts_common_lib_1.PkError("Invalid 'models' list w keys 'object', 'data' - response from " + url + " - not array", { modelObjs: modelObjs });
                            }
                        }
                        else if ('models' in respJson) {
                            modelObjs = respJson.models;
                        }
                        else {
                            throw new pk_ts_common_lib_1.PkError("Invalid 'models' list response from " + url + " - ", { respJson: respJson });
                        }
                    } // respJson should be array of model def objects - filter, format & sort
                    modelObjs = init_js_1.filterModelObjArr(modelObjs, opts);
                    return [2 /*return*/, modelObjs];
            }
        });
    });
}
exports.getRawModelObjs = getRawModelObjs;
function getOaiClient(provider) {
    if (provider === void 0) { provider = null; }
    provider = init_js_1.getLlmProvider(provider);
    var _a = init_js_1.getProviderConfig(provider), baseURL = _a.baseURL, apiKey = _a.apiKey;
    var clientCreateParams = { apiKey: apiKey, baseURL: baseURL, timeout: init_js_1.timeout };
    console.log("getOaiClient:clientCreateParams:", clientCreateParams);
    var client = new openai_1["default"](clientCreateParams);
    return client;
}
exports.getOaiClient = getOaiClient;
/**
 * Takes a model name (id) and array of model def objects
 * Returns the model def object for the given model name
 */
function getModelByName(name, modelObjArr) {
    for (var _i = 0, modelObjArr_1 = modelObjArr; _i < modelObjArr_1.length; _i++) {
        var modelObj = modelObjArr_1[_i];
        if (modelObj.id === name) {
            return modelObj;
        }
    }
    throw new pk_ts_common_lib_1.PkError("Model " + name + " not found in model obj array:", { modelObjArr: modelObjArr });
}
exports.getModelByName = getModelByName;
function parseChatRes(resp) {
    if (!pk_ts_common_lib_1.isObject(resp)) {
        throw new pk_ts_common_lib_1.PkError("parseChatRes: resp is not an object:", { resp: resp });
    }
    var choices = resp === null || resp === void 0 ? void 0 : resp.choices;
    if (!Array.isArray(choices)) {
        throw new pk_ts_common_lib_1.PkError("Choices not array:", { resp: resp, choices: choices });
    }
    if (choices.length !== 1) {
        throw new pk_ts_common_lib_1.PkError("Choices  array not 1:", { resp: resp, choices: choices });
    }
    var choice = choices[0];
    if (!pk_ts_common_lib_1.isObject(choice)) {
        throw new pk_ts_common_lib_1.PkError("Choice not object:", { resp: resp, choice: choice });
    }
    var message = choice === null || choice === void 0 ? void 0 : choice.message; // A message object - could have `content` (text), or ?.function_call obj;
    if (message.content) {
        return message.content;
    }
    if (message.function_call) {
        var functionName = message.function_call.name;
        var functionArgs = JSON.parse(message.function_call.arguments);
        return { functionName: functionName, functionArgs: functionArgs };
    }
    throw new pk_ts_common_lib_1.PkError("Message not content or function_call:", { resp: resp, message: message });
}
exports.parseChatRes = parseChatRes;
/**
 * Chat with OpenAI API
 * @param {string} provider - default: 'lms'
 * @param {string|string[]|IMsgParams} msgs - If IMsgParams Object, contains sMsg & uMsg
 * if string or string[], contains system messages - prompt for user message.
 *
 * system message or array of system messages - if sysMsg is a key in systemMessages, use the value. Concatenates all system messages into one string.
 * @param {string} uMsg - user message or array of user messages - if uMsg is a key in usrMessages, use the value. Concatenates all user messages into one string.
 */
//export async function chat(provider = 'lms', sysMsg: string | string[] = 'ai', uMsg: string | string[] = '') {
//export async function chat(provider = 'lms', msgs?: string | string[] | IMsgsParams) {
//export async function chat(provider = null, ...msgs) {
/*
export async function chat(...args) {
  let hOpts = {
    provider: "The provider to use. Defaults to 'openai'",
    sMsg: "The system message to use. Defaults to 'default'",
    dropSchema: "If true, drop the schema from the ChatLog. Defaults to false",
    followup: "How to ask for followup - 'input' (default), 'editor' (open in editor), 'multi' - multiline,  'none' (no followup)",
  };
  console.log(`in chat - args:`, args);
  let { arr: msgs, opts } = parseArgs(args);
  msgs = mkArray(msgs);
  let { provider = "openai", sMsg, dropSchema, filter, followup } = opts;
  provider = getLlmProvider(provider);
  let config = getProviderConfig(provider);
  let chatconfig = config.defaultOpts || {};
  filter = filter || config.defaultFilter;
  //console.log(`in chat:`, {msgs, opts},);

  if (isEmpty(msgs) || opts.ask) {
    let askmsg = await ask(`What do you want to ask?`);
    msgs.push(askmsg);
  }


  let messages: ChatCompletionMessageParam[];
  let client = getOaiClient(provider);
  let models = await getModelList(provider, { filter });
  let model;
  if (models.length === 1) {
    model = models[0];
  } else {
    model = await ask(`For [${provider}]: Which model?`, { choices: models });
  }
  //let model = await ask(`For [${provider}]: Which model?`, { choices: models });
  //let chatinfo = `[${provider}:${model}]-${dtFmt('dt')}`;
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo } = await mkLogDets({ provider, model, msgs, sMsg, chatconfig, });
  //let uMsg = usrmsg;
  messages = await mkMsgArr({ uMsg: usrmsg, sMsg });
  //await askConfirm(chatinfo);
  //await tmpConfirm(chatinfo);
  //
  let chatLog = await initChatLog({ outpath, chatconfig, dropSchema, label, provider, model, chatinfo, stamp, usrmsg, sysmsg, });

  //writeData(`# Chat Session: ${chatinfo}\n\n**Init Msgs:**\n${JSON5Stringify(messages)}\n\n`, outpath);

  //let usrMsg: string;
  let followupCnt = 0;
  while (true) {
    followupCnt++;
    let response = await client.chat.completions.create({
      messages,
      model,
      ...chatconfig,
    });
    let assistant = parseChatRes(response);
    writeData(`\n\n**${provider} Assistant:**\n${assistant}\n\n`, outpath, true);
    console.log(`\n\n${provider} Response:\n${assistant}\n\n`);
    await chatLog.addChatItem({ response, messages, usrmsg, assistant, chatinfo });
    //usrMsg = await ask(`${provider} chat: Followup?`,{type:followup});
    usrmsg = await ask(`${provider} chat: Followup?`);
    if (!usrmsg) {
      console.log("Aborting");
      break;
    }
    //writeData(`\n\n**Followup:**\n${usrmsg}\n\n`, outpath, true);
    writeData(`\n\n---\n\n# Followup ${followupCnt}:\n\n**User:**\n${usrmsg}\n\n`, outpath, true);
    messages.push({ role: 'assistant', content: assistant });
    messages.push({ role: 'user', content: usrmsg });
  }
  console.log(`\nDone w. Chat\n - Output: ${outpath}`);
}
  */
/**
 * Non interactive chat completion - just return the response string
 * All params required -
 * @param {string} provider - default: 'lms'
 * @param {string} model
 * @param messages - the prepared system & user messages
 */
/*
export async function chatTask({ provider, model, msgs, opts }: GenObj = {}) {
  if (!provider) {
    provider = 'lms';
  }
  let config = getProviderConfig(provider);
  if (!model) {
    model = config.model || config.defaultModel;
  }
  if (!model) {
    model = await getModelByIdx();
  }
  //let content = mkMsgStr(msgs);
  let content = await expandMsgs(msgs);
  let messages = [{ role: 'user', content }];

  let client = getOaiClient(provider);
  let response = await client.chat.completions.create({
    //@ts-ignore
    messages,
    model,
  });
  let assistant = parseChatRes(response);
  let logItem = LogItem.create({
    //response, assistant, model, provider, config, content, messages:content,
    content, config, messages, model, opts, provider, response, assistant,
  });
  await logItem.save();
  return assistant;
}
  */
//# sourceMappingURL=oaiLib.js.map