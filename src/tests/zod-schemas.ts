/**
 * Test various Zod schemas
 */
// NPM Imports
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// Pk Lib Imports

import {
  GenObj, typeOf, writeData, ajvSchema, isSimpleObject, PkError, isEmpty, mkArray, Strings,
  isString, dbgWrt,
  ask, multiAsk, dtFmt, parseArgs, JSON5Stringify, JSONStringify, inArr1NinArr2, strIncludesAny,
} from 'pk-ts-node-lib';


const FunctionNameSchema = z.string()
  .min(1)
  .describe('A valid TypeScript function name that was exported from the source file')
  .refine((name) => /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name), {
    message: 'Must be a valid TypeScript identifier'
  });

export const FunctionNamesSchema = z.object({
  functionNames: z.array(FunctionNameSchema).describe('An array of exported function names'),
});

export const tstZods = {
  /*
  str: z.string(),
  strArr: z.array(z.string()),
  funcs: z.object({
    name: z.string().describe('The name of the function'),
    age: z.number().describe('The age of the function'),
  }),
  */
  //fncNames: z.object({ functionNames: z.array(FunctionNameSchema).describe('An array of exported function names'), }),
  fncNames: FunctionNamesSchema,
}

export function tstZodSchemas(keyx?:Strings) {
  if (isEmpty(keyx)) {
    keyx = Object.keys(tstZods);
  }
  let keys = mkArray(keyx);
  let schemas:GenObj = {};
  for (let key of keys) {
    if (!tstZods[key]) {
      throw new PkError(`Invalid key:`, { key });
    }
    let zod = tstZods[key];
    let schema = zodToJsonSchema(zod);
    schemas[key] = schema;
  }


//  let zods = keys.map(k => tstZods[k]);
//  let schemas = zods.map(zod => zodToJsonSchema(zod));



  return schemas;

}