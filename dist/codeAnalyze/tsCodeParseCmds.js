/**
 * Rules/Instructions for ai-sdk generateObject for parsing TS Code Files
 * Uses schemas from zodTsSchemas.ts
 */
// NPM Imports
import "zod-metadata/register";
// Local Imports
import { sdkFileMsg, decompSchema, } from '../init.js';
// Exports
export const tsCompTypes = ['class', 'function', 'interface', 'type', 'variable', 'enum',];
export const tsCompStr = `[${tsCompTypes.join(',')}]`;
// How to describe the things typescript exports
export const tsExpDef = "entities/symbols/declarations/items";
/**
 * Test messages for sdk generateObject
 */
export function mkDecompParams(fpath = './src/codeAnalyze/zodTsSchemas.ts') {
    let messages = [
        mkMsgObj(sysMsg, 'system'),
        sdkFileMsg(fpath, 'system'),
        //sdkFileMsgFPart(fpath, 'system'),
        mkMsgObj(usrMsg),
    ];
    return { messages, schema: decompSchema, };
}
export function mkMsgObj(content, role = 'user') {
    return {
        content, role,
    };
}
// OAI suggested list of all exportable items from TS
export const exportableItems = [
    'class',
    'function',
    'async function',
    'generator function',
    'const',
    'let',
    'var',
    'enum',
    'namespace',
    'type',
    'interface',
    'default',
    'decorator function',
    'decorator factory',
    'class decorator',
    'method decorator',
    'property decorator',
    'parameter decorator',
    're-export all',
    're-export specific',
    're-export alias',
    're-export default',
    're-export namespace',
];
// Testing AI-SDK generateObject with instructions & zod schemas
let sysMsg = `You are an expert TypeScript/JavaScript code analyzer. 

TypeScript can export many ${tsExpDef}, including ${tsCompStr}, among others.

Exported typescript ${tsExpDef} categories include: ${tsCompStr}

The source code of a TypeScript file is provided as one of the messages.

Identify all exported ${tsExpDef} in the TypeScript source file provided and classify them by type.

Your response should be a json object that follows the json schema provided.

`;
let usrMsg = `Please identify all exported TypeScript ${tsExpDef} in this TypeScript source file as per the schema`;
//# sourceMappingURL=tsCodeParseCmds.js.map