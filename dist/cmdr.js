"use strict";
/**
 * Use Commander for CLI script
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
exports.__esModule = true;
exports.FuncSigSchema = exports.StringArraySchema = void 0;
// NPM Imports
var commander_1 = require("commander");
var zod_1 = require("zod");
exports.StringArraySchema = zod_1.z.string().array();
exports.FuncSigSchema = zod_1.z.object({
    functionName: zod_1.z.string().describe('Exported function name'),
    functionSignatures: zod_1.z.string().array().describe('Array of all signatures for the function')
}).describe('Object keyed by each exported TypeScript function name to array of all the function signatures').strict();
var FunctionSignaturesSchemaObj = zod_1.z.object({
    functions: zod_1.z.record(zod_1.z.string().describe("The name of the exported function"), // Key: Function name
    zod_1.z.array(zod_1.z.string().describe("The TypeScript signature of the function")).describe("An array of TypeScript function signatures for the function")).describe("A mapping of exported function names to their TypeScript signatures")
});
var FunctionSignaturesSchema = zod_1.z.record(zod_1.z.string().describe("The name of the exported function"), // Key: Function name
zod_1.z.array(zod_1.z.string().describe("The TypeScript signature of the function")).describe("An array of TypeScript function signatures for the function")).describe("A mapping of exported function names to their TypeScript signatures");
//export const 
// PK-Lib imports
var pk_ts_sqlite_lib_1 = require("pk-ts-sqlite-lib");
//Local Imports
var init_js_1 = require("./init.js");
var funcsCmd = new commander_1.Command('funcs')
    .description("Test 'generateObject for common func names")
    .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
    .action(function (filter, options) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, provider, _a, client, modelName, obj, opath, e_1, errPath;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = program.opts();
                _a = opts.provider;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, init_js_1.askLlmProvider()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                provider = _a;
                client = init_js_1.getPkClient(provider);
                return [4 /*yield*/, client.getModelName(filter)];
            case 3:
                modelName = _b.sent();
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                return [4 /*yield*/, client.sdkObject('get-funcs', init_js_1.FunctionNamesSchema, modelName)];
            case 5:
                obj = _b.sent();
                opath = pk_ts_sqlite_lib_1.dbgWrt(obj, 'funcsObj');
                console.log("Wrote funcs obj to: [" + opath + "]");
                return [3 /*break*/, 7];
            case 6:
                e_1 = _b.sent();
                errPath = pk_ts_sqlite_lib_1.dbgWrt(e_1, 'ErrOut');
                console.error("Caught error:", e_1, "wrote to [" + errPath + "]");
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
var program = new commander_1.Command()
    .name('Execute LLM Commands')
    .option('-p, --provider <name>', 'The Provider name', '');
var modelsCmd = new commander_1.Command('models')
    .description("List models for provider")
    .argument('[filter]', 'Filter Models by', '')
    .action(function (filter, options) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, provider, _a, client, models, names, cnt;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = program.opts();
                _a = opts.provider;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, init_js_1.askLlmProvider()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                provider = _a;
                client = init_js_1.getPkClient(provider);
                return [4 /*yield*/, client.filterModels(filter)];
            case 3:
                models = _b.sent();
                pk_ts_sqlite_lib_1.dbgWrt(models, provider + "-models");
                names = client.modelObjsToNames(models);
                cnt = models.length;
                //    let connection = new AiSdk(provider);
                //    let models = await connection.getModels();
                console.log("In ModelsCmd", { filter: filter, options: options, opts: opts, models: models, names: names, cnt: cnt });
                return [2 /*return*/];
        }
    });
}); });
var modelNameCmd = new commander_1.Command('modelName')
    .description("List models for provider")
    .argument('[filter]', 'Filter Models by "all", "default", "current", or a substring', '')
    .action(function (filter, options) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, provider, _a, client, modelName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = program.opts();
                _a = opts.provider;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, init_js_1.askLlmProvider()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                provider = _a;
                client = init_js_1.getPkClient(provider);
                return [4 /*yield*/, client.getModelName(filter)];
            case 3:
                modelName = _b.sent();
                console.log({ modelName: modelName });
                return [2 /*return*/];
        }
    });
}); });
var askChatCmd = new commander_1.Command('asksdkchat')
    .description("Arg is sysMsgKey - prompt for uMsg Chat with AI")
    .argument('[msg]', 'Initial Usr Msg', '')
    .action(function (msg, options) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, provider, _a, client, chatRes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = program.opts();
                _a = opts.provider;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, init_js_1.askLlmProvider()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                provider = _a;
                client = init_js_1.getPkClient(provider);
                return [4 /*yield*/, client.sdkChat(msg, true)];
            case 3:
                chatRes = _b.sent();
                pk_ts_sqlite_lib_1.dbgWrt(chatRes);
                console.log({ chatRes: chatRes });
                return [2 /*return*/];
        }
    });
}); });
var chatCmd = new commander_1.Command('sdkchat')
    .description("Chat with AI")
    .argument('[user]', 'Initial Usr Msg', '')
    .action(function (user, options) { return __awaiter(void 0, void 0, void 0, function () {
    var opts, provider, _a, client, chatRes;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                opts = program.opts();
                _a = opts.provider;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, init_js_1.askLlmProvider()];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                provider = _a;
                client = init_js_1.getPkClient(provider);
                return [4 /*yield*/, client.sdkChat(user)];
            case 3:
                chatRes = _b.sent();
                pk_ts_sqlite_lib_1.dbgWrt(chatRes);
                console.log({ chatRes: chatRes });
                return [2 /*return*/];
        }
    });
}); });
program.addCommand(askChatCmd);
program.addCommand(modelsCmd);
program.addCommand(modelNameCmd);
program.addCommand(chatCmd);
program.addCommand(funcsCmd);
await program.parseAsync(process.argv);
//# sourceMappingURL=cmdr.js.map