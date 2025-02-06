/**
 * TypeOrm for managing sqlite3 database for interaction w. AI Agents
 * Uses by pk-ts-sqlite-lib/typeorm, and sqlite-lib.ts from here
 */
// NPM Imports
import "reflect-metadata";
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
  BaseEntity, Point, BeforeInsert, AfterInsert, RelationOptions, AfterLoad,
  IsNull, Not,
  OneToMany, ManyToOne, JoinColumn, JoinTable, OneToOne, type Relation,
} from "typeorm";

import _ from 'lodash';

import { IsIn, IsOptional, IsDate, validate, } from 'class-validator';
import fs from "fs-extra";
import path from 'path';

// PkLib imports
import {
  GenObj, isEmpty, typeOf, intersect, inArr1NinArr2, isSubset,

}
  from 'pk-ts-common-lib';

import { stdOut,
  slashPath,
} from 'pk-ts-node-lib';

import {
  PkBaseEntity, PkBaseUser, getToDataSource, getToConfig, PkDataSource,
  PkError, dbgWrt, writeData, isDirectory, isFile,

} from "pk-ts-sqlite-lib/typeorm";


// Local Imports

import {
  FunctionDets, fncEntities, logEntities, getProviderConfig, ChatItem, ChatLog, chatEntities,
  commonExports, getDbPath, LogItem, stripBackticks, writeLog, MsgBuilder,
  systemMessages, usrMessages, getFileMsgObj, codeFiles, findKeyedEmbeds,
} from '../init.js';


// Implementation
let cascade: RelationOptions = { cascade: true, };

export async function getLogDS() {
  let database = './out/chatLog.sqlite';
  let ds = await PkDataSource.getToDataSource({ database, entities: logEntities });
  //let ds = await PkDataSource.getToDataSource({database, entities:[LogItem]});
  return ds;
}

export async function getMsgsDS(dropSchema = false) {
  let database = './out/msgs.sqlite';
  let ds = await PkDataSource.getToDataSource({ database, dropSchema, entities: [MsgBuilder] });
  return ds;
}

//let initMsgObjs = { systemMessages, usrMessages, txtMsgs: getFileMsgObj(), cmpMsgs };
export async function initMsgsDB(dropSchema = true) {
  console.log(`in initMsgsDB: dropSchema`, { dropSchema });
  let ds = await getMsgsDS(dropSchema);
  let enttype = 'msg';
  let msgtype = 'sys';
  // Sys msgs first
  for (let key in systemMessages) {
    let body = systemMessages[key];
    let msgObj = { key, body, msgtype, enttype };
    //@ts-ignore
    let msgB = MsgBuilder.create(msgObj);
    //let msgB =  new MsgBuilder(msgObj);
    //@ts-ignore
    await msgB.save();
  }
  msgtype = 'usr';
  let txtMsgs = getFileMsgObj();
  let aUmsgs = { ...txtMsgs, ...usrMessages };
  for (let key in aUmsgs) {
    let body = aUmsgs[key];
    let msgObj = { key, body, msgtype, enttype };
    //@ts-ignore
    let msgB = MsgBuilder.create(msgObj);
    //let msgB =  new MsgBuilder(msgObj);
    //@ts-ignore
    await msgB.save();
  }
  enttype = 'code';
  for (let key in codeFiles) {
    let codeobj = codeFiles[key];
    let msgObj = { key, codeobj, enttype };
    //@ts-ignore
    let msgB = MsgBuilder.create(msgObj);
    //@ts-ignore
    await msgB.save();
  }
  return ds;
}

export async function assembleParentKeys(msg: string | MsgBuilder, depth = 0): Promise<string[]> {
  await getMsgsDS();
  if (typeof msg === 'string') {
    msg = await MsgBuilder.findByKey(msg);
  }
  depth++;



  console.log(`Enter assembleParentKeys: msgKey: [${msg.key}], depth: [${depth}], parentKeys:`, msg.parentKeys);
  let assKeys: string[] = [];


  for (let parentKey of msg.parentKeys) {
    let parentMsg = await MsgBuilder.findByKey(parentKey);
    let pparentKeys = parentMsg.parentKeys;
    for (let pparentKey of pparentKeys) {
      let tmpAssKeys = await assembleParentKeys(pparentKey, depth);
      for (let tmpAssKey of tmpAssKeys) {
        if (!assKeys.includes(tmpAssKey)) {
          assKeys.push(tmpAssKey);
        }
      }
      if (!assKeys.includes(pparentKey)) {
        assKeys.push(pparentKey);
      }
    }
    if (!assKeys.includes(parentKey)) {
      assKeys.push(parentKey);
    }
  }
  console.log(`Return assembleParentKeys: msgKey: [${msg.key}], depth: [${depth}], parentKeys:`, msg.parentKeys);



  return assKeys;
}

/**
 * Find all MsgBuilder obj in DB and process bodies to extract ancestors
 */
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
  /*
  for (let msg of allMsgs) {
    let assKeys = await assembleParentKeys(msg);
    msg.normParentKeys = assKeys;
    await msg.save();
  }
    */

  console.log(`done processing msgs db`);
  //let reactSsrMsg = await MsgBuilder.findByKey('react-ssr');
  //let pEm = findKeyedEmbeds(reactSsrMsg.body);
  //console.log(`reactSsrMsg:`, {reactSsrMsg, pEm});
}



/** Init the table of function defs if empty, return the DataSource */
export async function initFncDets(provider: string, model?: string) {
  let config = getProviderConfig(provider);
  model = model || config.model || config.defaultModel;
  let dbName = 'to-common-dec';
  let dbPath = getDbPath(provider, model, dbName);
  //let config: GenObj = getToConfig('sqlite', { database: dbPath, entities: fncEntities, });
  let dbConfig = { database: dbPath, entities: fncEntities, };
  let ds = await PkDataSource.getToDataSource(dbConfig);
  //@ts-ignore
  //let filename = db.filename;
  //let tblName = 'commondec';
  //let tbl = await createTbl(db, tblName, funcCols);
  //console.log(`Created table ${tblName} in ${dbPath}: filename: ${filename}`);

  for (let fn of commonExports) {
    let row = {
      model,
      provider,
      library: 'pk-ts-common-lib',
      file: 'common-operations.ts',
      language: 'typescript',
      type: fn.type,
      name: fn.name,
      //metadata: {weird:'test if JSON works'},
      //signature: fn.signature,
      //params: fn.params,
      //return: fn.return,
      //description: fn.description,
      //examples: fn.examples,
      //todos: fn.todos,
    };
    // Test if exists
    let found = await FunctionDets.findOneBy({ name: fn.name, });
    if (!found) {
      let fdets = FunctionDets.create(row);
      await fdets.save();
    }
  }
  return ds;
}

/**
 * Return the first empty function, or array of first `arr` empty fncs, or false
 */
export async function getEmptyFncMD({ provider, model, arr }: GenObj = {}) {
  //let limit = arr || 1;
  let providerConfig = getProviderConfig(provider);
  let ds = await initFncDets(provider, model);
  //let allFncs = await FunctionDets.findBy({metadata: null});
  //let allFncs = await FunctionDets.find({where:{metadata: null}});
  let allEmptyFncs = await FunctionDets.find({ where: { type: 'function', metadata: IsNull(), error: IsNull() } });
  //let allFncs = await FunctionDets.findBy({metadata: IsNull()});
  //let fncEnt = await FunctionDets.findOneBy({name: 'allProps'});
  let cnt = allEmptyFncs.length;
  if (!cnt) {
    console.log(`No Empty fncs left!`);
    return false;
  } else if (arr) {
    let emptyFncs = allEmptyFncs.slice(0, arr);
    console.log(`cnt Empty fncs: [${cnt}], returning entries for first: [${arr}]`);
    return emptyFncs;
  } else {
    let emptyFnc = allEmptyFncs[0];
    let eFncName = emptyFnc.name;
    console.log(`cnt Empty fncs: [${cnt}], returning entry for: [${eFncName}]`);
    return emptyFnc;
  }
}

/**
 * Return object keyed by fnc name, val MetaData
 */
export async function getFncsMD({ provider, model, opts }: GenObj = {}) {
  let config = getProviderConfig(provider);
  model = model || config.model || config.defaultModel;
  if (!model) {
    throw new PkError(`in dbReport, No Model for provider`, { provider, model, opts });
  }
  let ds = await initFncDets(provider, model);
  let allFncs = await FunctionDets.find({ where: { type: 'function', metadata: Not(IsNull()), error: IsNull() } });
  let ret: GenObj = {};
  for (let fdet of allFncs) {
    ret[fdet.name] = fdet.metadata;
  }
  return ret;
}

export async function dbReport({ provider, model, opts }: GenObj = {}) {
  let config = getProviderConfig(provider);
  model = model || config.model || config.defaultModel;
  if (!model) {
    throw new PkError(`in dbReport, No Model for provider`, { provider, model, opts });
  }
  let dbName = 'to-common-dec';
  let dbPath = getDbPath(provider, model, dbName);
  if (!isFile(dbPath)) {
    throw new PkError(`dbReport dbPath: [${dbPath}] not found`, { provider, model, opts });
  }
  let ds = await initFncDets(provider, model);
  let recs = await FunctionDets.find();
  let cnt = recs.length;
  console.log(`Found [${cnt}] function records in`, { dbPath, provider, model, opts });
  let out = `# DB Report for [${provider}-${model}-${dbPath}]\n\n`;
  for (let rec of recs) {
    out += `**Function ${rec.name}**\n\n**Body**\n\n${rec.body}\n\n\n`;
    out += `\n\n**Stripped Body**\n\n${stripBackticks(rec.body)}\n\n\n`;
  }
  writeLog(out);
}


/**
 * Create new DB, or new entry? Start with shared DB
 * Either way,
 * return ChatLog instance, with addChatItem() method
 */

export interface IChatLog {
  outpath?: string,
  label?: string,
  provider?: string,
  model?: string,
  stamp?: string,
  usrmsg?: string,
  sysmsg?: string,
  chatconfig?: any,
  chatinfo?: string,
  dropSchema?: boolean,
};
//export async function initChatLog({outpath, label, provider, model, stamp, usrmsg, chatconfig,chatinfo}:GenObj) {
export async function initChatLog(chatOpts: IChatLog) {
  let chatData = _.omit(chatOpts, ['dropSchema']);
  let dropSchema = chatOpts.dropSchema || false;
  let dbBase = './logs/chatLogs/chatLogs2.sqlite';
  let dbConfig = { database: dbBase, entities: chatEntities, dropSchema, };
  let ds = await PkDataSource.getToDataSource(dbConfig);
  let chatLog = ChatLog.create(chatData);
  await chatLog.save();
  return chatLog;
}







