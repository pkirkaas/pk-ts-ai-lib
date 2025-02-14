"use strict";
/**
 * More tests....
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
exports.tstDbLog = exports.tstFncJsons = void 0;
//PkLib Imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
// Local Imports
var init_js_1 = require("./init.js");
// JSON Imports
var GeminiAllProps_json_1 = __importDefault(require("./allPropsJsons/GeminiAllProps.json"));
with ({ type: "json" })
    ;
var ClaudeAllProps_json_1 = __importDefault(require("./allPropsJsons/ClaudeAllProps.json"));
with ({ type: "json" })
    ;
var OAIAllProps_json_1 = __importDefault(require("./allPropsJsons/OAIAllProps.json"));
with ({ type: "json" })
    ;
var fnc2schema_json_1 = __importDefault(require("./FncSchemas/fnc2schema.json"));
with ({ type: 'json' })
    ;
/**
 * Validates JSON schema itself, then the JSON results from OpenAI, Gemini & Claude
 */
function tstFncJsons() {
    var jsons = { geminiAllProps: GeminiAllProps_json_1["default"], claudeAllProps: ClaudeAllProps_json_1["default"], oaiAllProps: OAIAllProps_json_1["default"] };
    console.log("Validating fncSchema iteself");
    var validate = pk_ts_node_lib_1.ajvSchema(fnc2schema_json_1["default"]);
    console.log("Schema itself validate, now validate individual jsons");
    for (var key in jsons) {
        var json = jsons[key];
        if (validate(json)) {
            console.log("The [" + key + "] json is valid");
        }
        else {
            console.log("Validation of [" + key + "] return errors:");
            console.log(validate.errors);
        }
    }
    console.log("Validation finished");
}
exports.tstFncJsons = tstFncJsons;
function tstDbLog() {
    return __awaiter(this, void 0, void 0, function () {
        var ds, data, li, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, init_js_1.getLogDS()];
                case 1:
                    ds = _a.sent();
                    data = {
                        model: 'TstModel',
                        agent: 'Gemini',
                        config: { a: "chat-config" }
                    };
                    li = init_js_1.LogItem.create(data);
                    return [4 /*yield*/, li.save()];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
exports.tstDbLog = tstDbLog;
var fncs = {
    tstRL: function (prompt) { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!prompt) {
                        prompt = 'Def Say what?';
                    }
                    return [4 /*yield*/, pk_ts_node_lib_1.multiAsk(prompt)];
                case 1:
                    res = _a.sent();
                    console.log("Done w. tstRL, res:", { res: res }, 'resOut:');
                    pk_ts_node_lib_1.stdOut(res);
                    return [2 /*return*/];
            }
        });
    }); },
    tstDbgLog: function () { return __awaiter(void 0, void 0, void 0, function () {
        var lgRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("About to init dbLog");
                    return [4 /*yield*/, tstDbLog()];
                case 1:
                    lgRes = _a.sent();
                    console.log("Done w. tstDbLog, res:", { lgRes: lgRes });
                    return [2 /*return*/];
            }
        });
    }); },
    tstFncJsons: function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = tstFncJsons();
            console.log("Done w. tstFncJsons, res:", { res: res });
            return [2 /*return*/];
        });
    }); }
};
await pk_ts_node_lib_1.runCli(fncs);
//# sourceMappingURL=test.js.map