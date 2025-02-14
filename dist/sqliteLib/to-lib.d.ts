/**
 * TypeOrm for managing sqlite3 database for interaction w. AI Agents
 * Uses by pk-ts-sqlite-lib/typeorm, and sqlite-lib.ts from here
 */
import "reflect-metadata";
import { GenObj } from 'pk-ts-common-lib';
import { MsgBuilder } from '../init.js';
export declare function getLogDS(): Promise<any>;
export declare function getMsgsDS(dropSchema?: boolean): Promise<any>;
export declare function initMsgsDB(dropSchema?: boolean): Promise<any>;
export declare function assembleParentKeys(msg: string | MsgBuilder, depth?: number): Promise<string[]>;
/**
 * Find all MsgBuilder obj in DB and process bodies to extract ancestors
 */
/** Init the table of function defs if empty, return the DataSource */
export declare function initFncDets(provider: string, model?: string): Promise<any>;
/**
 * Return the first empty function, or array of first `arr` empty fncs, or false
 */
export declare function getEmptyFncMD({ provider, model, arr }?: GenObj): Promise<any>;
/**
 * Return object keyed by fnc name, val MetaData
 */
export declare function getFncsMD({ provider, model, opts }?: GenObj): Promise<import("pk-ts-common-lib").GenericObject>;
export declare function dbReport({ provider, model, opts }?: GenObj): Promise<void>;
/**
 * Create new DB, or new entry? Start with shared DB
 * Either way,
 * return ChatLog instance, with addChatItem() method
 */
export interface IChatLog {
    outpath?: string;
    label?: string;
    provider?: string;
    model?: string;
    stamp?: string;
    usrmsg?: string;
    sysmsg?: string;
    chatconfig?: any;
    chatinfo?: string;
    dropSchema?: boolean;
}
export declare function initChatLog(chatOpts: IChatLog): Promise<any>;
//# sourceMappingURL=to-lib.d.ts.map