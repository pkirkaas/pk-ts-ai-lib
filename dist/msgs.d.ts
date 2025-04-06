/**
 * Building messages for chat
 */
import { Strings } from 'pk-ts-node-lib';
import { WrapCodeObjs, MsgObj } from './init.js';
export type BuiltMsg = {
    sMsg: string;
    uMsg: string;
    msgKeys?: string[];
};
/**
 * Throws if any embeds remain in string(s)
 */
export declare function assertEmbeddeds(...strs: string[]): void;
/**
 * Throws if any embeds for type msgType remain in string
 */
export declare function assertEmbedsType(msgStr: string, msgType: string): void;
/**
 * Strip comments from msgStr. Don't love the comment syntax,
 * but for now: `{| This is a comment |}`
 */
export declare function stripComments(msgStr: any): any;
export declare const wrapPairs: {
    sysmsg: {
        open: string;
        close: string;
    };
    usrmsg: {
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
export declare const msgTypes: string[];
export declare const txtMsgTypes: string[];
export declare function wrapKeyType(key: string, msgType: string): string;
export declare function wordCnt(str: string): number;
/**
 * Test all the message keys in the system
 */
export declare function tstMsgs(typex?: Strings): Promise<void>;
/**
 * Builds a MsgObj for a given msg type - hard coded for now
 * @param msgType:string - 'sysmsg' | 'usrmsg' | 'code'
 * @param msgObj?:MsgObj - object of msg keys & msg strings to add to default
 */
export declare function getMsgObj(msgType: string, msgObj?: MsgObj): MsgObj;
export declare function extractMsgTags(str: string, msgType: string): string[];
export declare function assertMsgType(msgType: string): void;
export declare function tagReplace(tag: string, msgType: string, strip?: any): string;
/**
 * Return array of all sysMsg keys, or expand a sMsg key
 */
export declare function sysMsgs(sKey?: string): Promise<string>;
/**
 * Accept sysMsg keys, ask user for uMsg
 * @return Promise<BuiltMsg>
 */
export declare function askMsg(smsgx: Strings): Promise<BuiltMsg>;
/**
 * Takes msgx:Strings & returns BuiltMsg with uMsg & sMsg, with all substitutions
 * @param msgx:Strings - String or string[] Array of msgs or msg keys
 */
export declare const defaultSysMsg = "You are a highly specialized AI Advanced Software Engineering and Development assistant.\n\n\nYour audience is highly skilled software developers and engineers who require technical, detailed implementable solutions.\n\nYour response is not chatty or friendly, but neither is it just high level conceptual overview.\n\nYou consider your answer in depth, carefully, reason through step by step. You will provide a very detailed, thorough, complete, correct response, prioritizing correctness over speed.\n\nYou will ask clarifying questions if you need more information for your answer - it is much better to say you don't know than provide possibly incorrect information. Accuracy is essential.\n\nBefore you respond, you will review your solution again, and PLEASE, PLEASE take the extra time to double check.\n\n";
export declare function buildMsg(msgx: Strings): Promise<BuiltMsg>;
export declare function nestReplaceTags(msgStr: string, msgType: string, strip?: any): string;
export declare function buildSysMsg(msg: string): string;
/**
 * Keys w. source code file path, to be wrapped in triple backticks
 */
export declare let codeFiles: WrapCodeObjs;
export declare let systemMessages: {
    tstsim: string;
    tstrpt: string;
    default: string;
    code: string;
    python: string;
    rag: string;
    ai: string;
    ragnovel: string;
    hf: string;
    claude: string;
    aiclient: string;
    pyapp: string;
    llmgoals: string;
    aicodetrainbase: string;
    tsmorph: string;
    aicodetrain: string;
    tscodetrain: string;
    js: string;
    ts: string;
    node: string;
    sql: string;
    typeorm: string;
    zod: string;
    vscode: string;
    aiprep: string;
    embedding: string;
    pyqt: string;
    win: string;
    linux: string;
    wsl: string;
    pcspec: string;
    tsfnc: string;
    pureJson: string;
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
    pqt: string;
    aicodeprep: string;
    aicp1: string;
};
export declare let usrMessages: {
    wrappedschema: string;
    back: string;
    pqtBrowser: string;
    embeddings: string;
    aicp2: string;
    pqtAppFramework: string;
    aiapiparams: string;
    rag: string;
    tsrag: string;
    tsdecls: string;
    utsfncbody: string;
};
//# sourceMappingURL=msgs.d.ts.map