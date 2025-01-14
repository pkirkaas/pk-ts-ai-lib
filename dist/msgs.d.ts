/**
 * Building messages for chat
 */
import { Strings } from './init.js';
/**
 * Check if msgstr contains any unmatched embeddeds - [[.*]], {{.*}}, {|.*|}
 * @param msgStr - string to test
 * @return array of remaining embeddeds
 */
export declare function findEmbeddeds(msgStr: any): any[];
/**
 * Strip comments from msgStr. Don't love the comment syntax,
 * but for now: `{| This is a comment |}`
 */
export declare function stripComments(msgStr: any): any;
/** For a msg str, find all embed patterns '[[msgkey]]' & return obj keyed by key & embed
 *
 */
export declare function findKeyedEmbeds(msgStr: any): {};
/**
 * Just strip out the [[ ]] from the embed
 */
export declare function embedToKey(embed: any): any;
/**
 * Gets all the message keys for all msg objects, ensures no duplicates, & returns array of keys
 */
export declare function getMsgKeys(): {
    msgKeys: string[];
    codeKeys: string[];
    allKeys: any[];
};
export declare const askKey = "__ASK__";
export declare const wrapPairs: {
    msg: {
        open: string;
        close: string;
    };
    code: {
        open: string;
        close: string;
    };
    comment: {
        open: string;
        close: string;
    };
};
/**
 * Expand arrays of msg keys & msg strings to a single message string. Recursively expands embedded msg keys
 * to msg strings.
 * ?? Switch whether throw error on used key, or just ignore?
 *
 */
export declare function expandMsgs(...args: any[]): Promise<string>;
/**
 * Returns Object with all msg keys to their expanded values
 * @param msgs - opt - array of msg keys to expand, if not provided, all msgs are expanded
 */
export declare function getExpandedMsgs(...msgs: any[]): Promise<import("pk-ts-node-lib").GenericObject>;
export declare let wrappedSchemaStr: string;
/**
 * Keys w. source code file path, to be wrapped in triple backticks
 */
export declare let codeFiles: {
    fsb: string;
    fncSchema: string;
    ssrSrc: {
        fpaths: string;
        desc: string;
    };
    nextconfs: {
        fpaths: string[];
        desc: string;
    };
    cssmodules: {
        desc: string;
        fpaths: string;
    }[];
    fetsconfig: {
        fpaths: string;
        desc: string;
    };
    fepackage: {
        fpaths: string;
        desc: string;
    };
    daisynav: {
        fpaths: string;
        desc: string;
    };
    pknav: {
        fpaths: string;
        desc: string;
    };
    pkfelib: {
        desc: string;
        fpaths: string[];
    };
    mynextapp: {
        desc: string;
        fpaths: string[];
    };
    nmnav: {
        desc: string;
        fpaths: string;
    };
};
export declare let defaultSysMsg: string;
export declare let systemMessages: {
    default: string;
    code: string;
    python: string;
    ai: string;
    pyapp: string;
    llmgoals: string;
    aicodetrain: string;
    tscodetrain: string;
    js: string;
    ts: string;
    node: string;
    sql: string;
    typeorm: string;
    aiprep: string;
    embedding: string;
    pyqt: string;
    win: string;
    tsfnc: string;
    tsanalyze: string;
    auto: string;
    tsfncbody: string;
    webapp: string;
    webappauth: string;
    nextssr: string;
    tailwind: string;
    react: string;
    rcomp: string;
    reactcss: string;
    vite: string;
    reactemotion: string;
};
export declare let usrMessages: {
    pqt: string;
    pqtBrowser: string;
    embeddings: string;
    aicodeprep: string;
    aicp1: string;
    aicp2: string;
    pqtAppFramework: string;
    aiapiparams: string;
    rag: string;
    tsrag: string;
    tsdecls: string;
    utsfncbody: string;
};
export interface IMsgObj {
    [key: string]: string;
}
export declare let AllMsgs: IMsgObj;
/**
 * Combine all the message objects into a single object, checking for duplicate keys.
 */
export declare function getAllMsgs(...msgObjs: IMsgObj[]): IMsgObj;
export declare function getAllMsgsByObj(): Promise<{}>;
export declare function tstMsgStr(...msgs: any[]): Promise<string>;
/**
 * If the arg is not an array, put it into an array
 */
export declare function mkArray(arg: any): any;
export interface IMsgSet {
    usr?: Strings;
    sys?: Strings;
}
export declare let MsgSets: {};
/**
 * Test message keys - write to file & return
 * @param msgs - string | string[] | null
 *   if null, all keys & msgs
 *   if string/string[], check keys exist, output subset
 */
export declare function tstMsgKeys(msgs: any): IMsgObj;
export declare function wordCnt(str: string): number;
//# sourceMappingURL=msgs.d.ts.map