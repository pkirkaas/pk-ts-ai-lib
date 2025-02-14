"use strict";
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
exports.initChatLog = exports.dbReport = exports.getFncsMD = exports.getEmptyFncMD = exports.initFncDets = exports.assembleParentKeys = exports.initMsgsDB = exports.getMsgsDS = exports.getLogDS = void 0;
/**
 * TypeOrm for managing sqlite3 database for interaction w. AI Agents
 * Uses by pk-ts-sqlite-lib/typeorm, and sqlite-lib.ts from here
 */
// NPM Imports
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var lodash_1 = __importDefault(require("lodash"));
var typeorm_2 = require("pk-ts-sqlite-lib/typeorm");
// Local Imports
var init_js_1 = require("../init.js");
// Implementation
var cascade = { cascade: true };
function getLogDS() {
    return __awaiter(this, void 0, void 0, function () {
        var database, ds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = './out/chatLog.sqlite';
                    return [4 /*yield*/, typeorm_2.PkDataSource.getToDataSource({ database: database, entities: init_js_1.logEntities })];
                case 1:
                    ds = _a.sent();
                    //let ds = await PkDataSource.getToDataSource({database, entities:[LogItem]});
                    return [2 /*return*/, ds];
            }
        });
    });
}
exports.getLogDS = getLogDS;
function getMsgsDS(dropSchema) {
    if (dropSchema === void 0) { dropSchema = false; }
    return __awaiter(this, void 0, void 0, function () {
        var database, ds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    database = './out/msgs.sqlite';
                    return [4 /*yield*/, typeorm_2.PkDataSource.getToDataSource({ database: database, dropSchema: dropSchema, entities: [init_js_1.MsgBuilder] })];
                case 1:
                    ds = _a.sent();
                    return [2 /*return*/, ds];
            }
        });
    });
}
exports.getMsgsDS = getMsgsDS;
//let initMsgObjs = { systemMessages, usrMessages, txtMsgs: getFileMsgObj(), cmpMsgs };
function initMsgsDB(dropSchema) {
    if (dropSchema === void 0) { dropSchema = true; }
    return __awaiter(this, void 0, void 0, function () {
        var ds, enttype, msgtype, _a, _b, _i, key, body, msgObj, msgB, txtMsgs, aUmsgs, _c, _d, _e, key, body, msgObj, msgB, _f, _g, _h, key, codeobj, msgObj, msgB;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    console.log("in initMsgsDB: dropSchema", { dropSchema: dropSchema });
                    return [4 /*yield*/, getMsgsDS(dropSchema)];
                case 1:
                    ds = _j.sent();
                    enttype = 'msg';
                    msgtype = 'sys';
                    _a = [];
                    for (_b in init_js_1.systemMessages)
                        _a.push(_b);
                    _i = 0;
                    _j.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    key = _a[_i];
                    body = init_js_1.systemMessages[key];
                    msgObj = { key: key, body: body, msgtype: msgtype, enttype: enttype };
                    msgB = init_js_1.MsgBuilder.create(msgObj);
                    //let msgB =  new MsgBuilder(msgObj);
                    //@ts-ignore
                    return [4 /*yield*/, msgB.save()];
                case 3:
                    //let msgB =  new MsgBuilder(msgObj);
                    //@ts-ignore
                    _j.sent();
                    _j.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    msgtype = 'usr';
                    txtMsgs = init_js_1.getFileMsgObj();
                    aUmsgs = __assign(__assign({}, txtMsgs), init_js_1.usrMessages);
                    _c = [];
                    for (_d in aUmsgs)
                        _c.push(_d);
                    _e = 0;
                    _j.label = 6;
                case 6:
                    if (!(_e < _c.length)) return [3 /*break*/, 9];
                    key = _c[_e];
                    body = aUmsgs[key];
                    msgObj = { key: key, body: body, msgtype: msgtype, enttype: enttype };
                    msgB = init_js_1.MsgBuilder.create(msgObj);
                    //let msgB =  new MsgBuilder(msgObj);
                    //@ts-ignore
                    return [4 /*yield*/, msgB.save()];
                case 7:
                    //let msgB =  new MsgBuilder(msgObj);
                    //@ts-ignore
                    _j.sent();
                    _j.label = 8;
                case 8:
                    _e++;
                    return [3 /*break*/, 6];
                case 9:
                    enttype = 'code';
                    _f = [];
                    for (_g in init_js_1.codeFiles)
                        _f.push(_g);
                    _h = 0;
                    _j.label = 10;
                case 10:
                    if (!(_h < _f.length)) return [3 /*break*/, 13];
                    key = _f[_h];
                    codeobj = init_js_1.codeFiles[key];
                    msgObj = { key: key, codeobj: codeobj, enttype: enttype };
                    msgB = init_js_1.MsgBuilder.create(msgObj);
                    //@ts-ignore
                    return [4 /*yield*/, msgB.save()];
                case 11:
                    //@ts-ignore
                    _j.sent();
                    _j.label = 12;
                case 12:
                    _h++;
                    return [3 /*break*/, 10];
                case 13: return [2 /*return*/, ds];
            }
        });
    });
}
exports.initMsgsDB = initMsgsDB;
function assembleParentKeys(msg, depth) {
    if (depth === void 0) { depth = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var assKeys, _i, _a, parentKey, parentMsg, pparentKeys, _b, pparentKeys_1, pparentKey, tmpAssKeys, _c, tmpAssKeys_1, tmpAssKey;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, getMsgsDS()];
                case 1:
                    _d.sent();
                    if (!(typeof msg === 'string')) return [3 /*break*/, 3];
                    return [4 /*yield*/, init_js_1.MsgBuilder.findByKey(msg)];
                case 2:
                    msg = _d.sent();
                    _d.label = 3;
                case 3:
                    depth++;
                    console.log("Enter assembleParentKeys: msgKey: [" + msg.key + "], depth: [" + depth + "], parentKeys:", msg.parentKeys);
                    assKeys = [];
                    _i = 0, _a = msg.parentKeys;
                    _d.label = 4;
                case 4:
                    if (!(_i < _a.length)) return [3 /*break*/, 11];
                    parentKey = _a[_i];
                    return [4 /*yield*/, init_js_1.MsgBuilder.findByKey(parentKey)];
                case 5:
                    parentMsg = _d.sent();
                    pparentKeys = parentMsg.parentKeys;
                    _b = 0, pparentKeys_1 = pparentKeys;
                    _d.label = 6;
                case 6:
                    if (!(_b < pparentKeys_1.length)) return [3 /*break*/, 9];
                    pparentKey = pparentKeys_1[_b];
                    return [4 /*yield*/, assembleParentKeys(pparentKey, depth)];
                case 7:
                    tmpAssKeys = _d.sent();
                    for (_c = 0, tmpAssKeys_1 = tmpAssKeys; _c < tmpAssKeys_1.length; _c++) {
                        tmpAssKey = tmpAssKeys_1[_c];
                        if (!assKeys.includes(tmpAssKey)) {
                            assKeys.push(tmpAssKey);
                        }
                    }
                    if (!assKeys.includes(pparentKey)) {
                        assKeys.push(pparentKey);
                    }
                    _d.label = 8;
                case 8:
                    _b++;
                    return [3 /*break*/, 6];
                case 9:
                    if (!assKeys.includes(parentKey)) {
                        assKeys.push(parentKey);
                    }
                    _d.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 4];
                case 11:
                    console.log("Return assembleParentKeys: msgKey: [" + msg.key + "], depth: [" + depth + "], parentKeys:", msg.parentKeys);
                    return [2 /*return*/, assKeys];
            }
        });
    });
}
exports.assembleParentKeys = assembleParentKeys;
/**
 * Find all MsgBuilder obj in DB and process bodies to extract ancestors
 */
/*
export async function processMsgsDB(dropSchema = false) {
  console.log(`processing msgs db, dropSchema`, { dropSchema });
  if (dropSchema) {
    await initMsgsDB(dropSchema);
  } else {
    await getMsgsDS();
  }
  let allMsgs = await MsgBuilder.getMsgs('msg');
  let allCode = await MsgBuilder.getMsgs('code');
  //findKeyedEmbeds
  let keys = allMsgs.map(m => m.key);
  let codeKeys = allCode.map(m => m.key);
  //console.log(`found ${keys.length} MsgBuilder objects, keys:`, keys);
  for (let msg of allMsgs) {
    let embedKeys = Object.keys(findKeyedEmbeds(msg.body));
    let parentKeys = intersect(embedKeys, keys);
    let extraKeys = inArr1NinArr2(embedKeys, keys);
    let unmatchedKeys = inArr1NinArr2(extraKeys, codeKeys);
    if (unmatchedKeys.length) {
      console.error(`unmatched Embed Keys:`, unmatchedKeys);
    }
    msg.parentKeys = parentKeys;
    await msg.save();
  }
  //
  let tstKey = 'next-ssr';
  let tstMsg = await MsgBuilder.findByKey(tstKey);
  let tstMsgPKeys = tstMsg.parentKeys;
  //let assKeys = await assembleParentKeys(tstKey);
  let assKeys = await tstMsg.assembleParentKeys();
  let assMsg = await tstMsg.assembleMsg();
  console.log(`found assKeys with method for ${tstKey}:`, { tstMsgPKeys, assKeys, assMsg });
  stdOut(assMsg);
  // Hmm - tst assembleParentKeys

  console.log(`done processing msgs db`);
}
  */
/** Init the table of function defs if empty, return the DataSource */
function initFncDets(provider, model) {
    return __awaiter(this, void 0, void 0, function () {
        var config, dbName, dbPath, dbConfig, ds, _i, commonExports_1, fn, row, found, fdets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = init_js_1.getProviderConfig(provider);
                    model = model || config.model;
                    dbName = 'to-common-dec';
                    dbPath = init_js_1.getDbPath(provider, model, dbName);
                    dbConfig = { database: dbPath, entities: init_js_1.fncEntities };
                    return [4 /*yield*/, typeorm_2.PkDataSource.getToDataSource(dbConfig)];
                case 1:
                    ds = _a.sent();
                    _i = 0, commonExports_1 = init_js_1.commonExports;
                    _a.label = 2;
                case 2:
                    if (!(_i < commonExports_1.length)) return [3 /*break*/, 6];
                    fn = commonExports_1[_i];
                    row = {
                        model: model,
                        provider: provider,
                        library: 'pk-ts-common-lib',
                        file: 'common-operations.ts',
                        language: 'typescript',
                        type: fn.type,
                        name: fn.name
                    };
                    return [4 /*yield*/, init_js_1.FunctionDets.findOneBy({ name: fn.name })];
                case 3:
                    found = _a.sent();
                    if (!!found) return [3 /*break*/, 5];
                    fdets = init_js_1.FunctionDets.create(row);
                    return [4 /*yield*/, fdets.save()];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [2 /*return*/, ds];
            }
        });
    });
}
exports.initFncDets = initFncDets;
/**
 * Return the first empty function, or array of first `arr` empty fncs, or false
 */
function getEmptyFncMD(_a) {
    var _b = _a === void 0 ? {} : _a, provider = _b.provider, model = _b.model, arr = _b.arr;
    return __awaiter(this, void 0, void 0, function () {
        var providerConfig, ds, allEmptyFncs, cnt, emptyFncs, emptyFnc, eFncName;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    providerConfig = init_js_1.getProviderConfig(provider);
                    return [4 /*yield*/, initFncDets(provider, model)];
                case 1:
                    ds = _c.sent();
                    return [4 /*yield*/, init_js_1.FunctionDets.find({ where: { type: 'function', metadata: typeorm_1.IsNull(), error: typeorm_1.IsNull() } })];
                case 2:
                    allEmptyFncs = _c.sent();
                    cnt = allEmptyFncs.length;
                    if (!cnt) {
                        console.log("No Empty fncs left!");
                        return [2 /*return*/, false];
                    }
                    else if (arr) {
                        emptyFncs = allEmptyFncs.slice(0, arr);
                        console.log("cnt Empty fncs: [" + cnt + "], returning entries for first: [" + arr + "]");
                        return [2 /*return*/, emptyFncs];
                    }
                    else {
                        emptyFnc = allEmptyFncs[0];
                        eFncName = emptyFnc.name;
                        console.log("cnt Empty fncs: [" + cnt + "], returning entry for: [" + eFncName + "]");
                        return [2 /*return*/, emptyFnc];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getEmptyFncMD = getEmptyFncMD;
/**
 * Return object keyed by fnc name, val MetaData
 */
function getFncsMD(_a) {
    var _b = _a === void 0 ? {} : _a, provider = _b.provider, model = _b.model, opts = _b.opts;
    return __awaiter(this, void 0, void 0, function () {
        var config, ds, allFncs, ret, _i, allFncs_1, fdet;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = init_js_1.getProviderConfig(provider);
                    model = model || config.model;
                    if (!model) {
                        throw new typeorm_2.PkError("in dbReport, No Model for provider", { provider: provider, model: model, opts: opts });
                    }
                    return [4 /*yield*/, initFncDets(provider, model)];
                case 1:
                    ds = _c.sent();
                    return [4 /*yield*/, init_js_1.FunctionDets.find({ where: { type: 'function', metadata: typeorm_1.Not(typeorm_1.IsNull()), error: typeorm_1.IsNull() } })];
                case 2:
                    allFncs = _c.sent();
                    ret = {};
                    for (_i = 0, allFncs_1 = allFncs; _i < allFncs_1.length; _i++) {
                        fdet = allFncs_1[_i];
                        ret[fdet.name] = fdet.metadata;
                    }
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.getFncsMD = getFncsMD;
function dbReport(_a) {
    var _b = _a === void 0 ? {} : _a, provider = _b.provider, model = _b.model, opts = _b.opts;
    return __awaiter(this, void 0, void 0, function () {
        var config, dbName, dbPath, ds, recs, cnt, out, _i, recs_1, rec;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    config = init_js_1.getProviderConfig(provider);
                    model = model || config.model;
                    if (!model) {
                        throw new typeorm_2.PkError("in dbReport, No Model for provider", { provider: provider, model: model, opts: opts });
                    }
                    dbName = 'to-common-dec';
                    dbPath = init_js_1.getDbPath(provider, model, dbName);
                    if (!typeorm_2.isFile(dbPath)) {
                        throw new typeorm_2.PkError("dbReport dbPath: [" + dbPath + "] not found", { provider: provider, model: model, opts: opts });
                    }
                    return [4 /*yield*/, initFncDets(provider, model)];
                case 1:
                    ds = _c.sent();
                    return [4 /*yield*/, init_js_1.FunctionDets.find()];
                case 2:
                    recs = _c.sent();
                    cnt = recs.length;
                    console.log("Found [" + cnt + "] function records in", { dbPath: dbPath, provider: provider, model: model, opts: opts });
                    out = "# DB Report for [" + provider + "-" + model + "-" + dbPath + "]\n\n";
                    for (_i = 0, recs_1 = recs; _i < recs_1.length; _i++) {
                        rec = recs_1[_i];
                        out += "**Function " + rec.name + "**\n\n**Body**\n\n" + rec.body + "\n\n\n";
                        out += "\n\n**Stripped Body**\n\n" + init_js_1.stripBackticks(rec.body) + "\n\n\n";
                    }
                    init_js_1.writeLog(out);
                    return [2 /*return*/];
            }
        });
    });
}
exports.dbReport = dbReport;
;
//export async function initChatLog({outpath, label, provider, model, stamp, usrmsg, chatconfig,chatinfo}:GenObj) {
function initChatLog(chatOpts) {
    return __awaiter(this, void 0, void 0, function () {
        var chatData, dropSchema, dbBase, dbConfig, ds, chatLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chatData = lodash_1["default"].omit(chatOpts, ['dropSchema']);
                    dropSchema = chatOpts.dropSchema || false;
                    dbBase = './logs/chatLogs/chatLogs2.sqlite';
                    dbConfig = { database: dbBase, entities: init_js_1.chatEntities, dropSchema: dropSchema };
                    return [4 /*yield*/, typeorm_2.PkDataSource.getToDataSource(dbConfig)];
                case 1:
                    ds = _a.sent();
                    chatLog = init_js_1.ChatLog.create(chatData);
                    return [4 /*yield*/, chatLog.save()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, chatLog];
            }
        });
    });
}
exports.initChatLog = initChatLog;
//# sourceMappingURL=to-lib.js.map