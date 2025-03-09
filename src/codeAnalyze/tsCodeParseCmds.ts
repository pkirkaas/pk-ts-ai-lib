/**
 * Rules/Instructions for ai-sdk generateObject for parsing TS Code Files
 * Uses schemas from zodTsSchemas.ts
 */

// NPM Imports
import "zod-metadata/register";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { zodSchema } from "ai";
import {
  generateText, CoreUserMessage, CoreSystemMessage, CoreAssistantMessage, CoreToolMessage,
  generateObject, GenerateTextResult, CoreMessage, FilePart,
} from 'ai';

// PKLIB Imports
import { GenObj, isObject, isSimpleObject, isEmpty,
} from 'pk-ts-node-lib';

// Local Imports
import {sdkFileMsg,   sdkFileMsgFPart,
decompSchema,parameterSchema, typeParameterSchema, exceptionSchema, baseComponentSchema, 
functionSignatureSchema, functionComponentSchema,
 } from '../init.js'; 

// Exports

export const schemaTypeDefs = {
  class: {
  },
  function: {
  },
  interface: {
  },
  type: {
  },
  variable: {
  },
  enum: {
  },
};
//export const tsCompTypes = ['class', 'function', 'interface', 'type', 'variable', 'enum',] as const;

// Define tsCompTypes as a readonly tuple that can be used with z.enum()
export const tsCompTypes = ['class', 'function', 'interface', 'type', 'variable', 'enum'] as const;

export const tsCompStr = `[${tsCompTypes.join(',')}]`;

// How to describe the things typescript exports
export const tsExpDef="entities/symbols/declarations/items";
/**
 * Test messages for sdk generateObject
 */
export function mkDecompParams(fpath='./src/codeAnalyze/zodTsSchemas.ts') {
  let messages:CoreMessage[] = [
    mkMsgObj(sysMsg,'system'),
    sdkFileMsg(fpath, 'system'),
    //sdkFileMsgFPart(fpath, 'system'),
    mkMsgObj(usrMsg),
  ];
  return {messages, schema:decompSchema,};
} 

export type Role = 'user' | 'assistant' | 'system' | 'tool';
export function mkMsgObj(content:any, role:Role='user'):CoreMessage {
  return {
    content, role,
  }
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
] as const;


// Testing AI-SDK generateObject with instructions & zod schemas

let sysMsg = `You are an expert TypeScript/JavaScript code analyzer. 

TypeScript can export many ${tsExpDef}, including ${tsCompStr}, among others.

Exported typescript ${tsExpDef} categories include: ${tsCompStr}

The source code of a TypeScript file is provided as one of the messages.

Identify all exported ${tsExpDef} in the TypeScript source file provided and classify them by type.

Your response should be a json object that follows the json schema provided.

`;

let usrMsg = `Please identify all exported TypeScript ${tsExpDef} in this TypeScript source file as per the schema`;
