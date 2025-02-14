"use strict";
/** Sigh. HF has it's own API & JS Client - not OpenAI's. */
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
exports.hfChat = exports.defaultSystem = exports.defaultContent = exports.hf = exports.hfModels = void 0;
exports.hfModels = {
    gemma22b: "google/gemma-2-2b-it",
    llama318b: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    qwen2_5_72b: "Qwen/Qwen2.5-72B-Instruct",
    llama3170b: "meta-llama/Meta-Llama-3.1-70B-Instruct",
    phi3mini4k: "microsoft/Phi-3-mini-4k-instruct"
};
var pk_ts_common_lib_1 = require("pk-ts-common-lib");
var inference_1 = require("@huggingface/inference");
exports.hf = new inference_1.HfInference(process.env.HF_API_KEY);
exports.defaultContent = "Which is larger, Germany or France?";
exports.defaultSystem = "You are a helpful assistant.";
function hfChat(content, model) {
    if (content === void 0) { content = exports.defaultContent; }
    if (model === void 0) { model = null; }
    return __awaiter(this, void 0, void 0, function () {
        var models, messages, ans;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    models = Object.values(exports.hfModels);
                    if (!model) {
                        model = models[0]; // Default to first model
                    }
                    if (model in exports.hfModels) {
                        model = exports.hfModels[model];
                    }
                    if (!models.includes(model)) {
                        throw new pk_ts_common_lib_1.PkError("Model " + model + " not in hfModels:", { models: models });
                    }
                    console.log("hfChat: model=" + model);
                    messages = [
                        // {role:"system", content: defaultSystem},
                        { role: "user", content: content },
                    ];
                    return [4 /*yield*/, exports.hf.chatCompletion({
                            model: model,
                            messages: messages
                        })];
                case 1:
                    ans = _a.sent();
                    console.log("hfChat: ans:", { ans: ans });
                    return [2 /*return*/, ans];
            }
        });
    });
}
exports.hfChat = hfChat;
//# sourceMappingURL=hflib.js.map