/**
 * Zod/JSON schemas for TS Code Analysis
 */

//import 
// NPM Imports
import "zod-metadata/register";
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { zodSchema } from "ai";

// PKLIB Imports
import { GenObj, isObject, isSimpleObject, isEmpty,
} from 'pk-ts-node-lib';

// Local Imports
import {sdkFileMsg, tsCompStr,  tsCompTypes, sdkFileMsgFPart,
 } from '../init.js'; 

// Exports

/**
 * Kinds of components exported by TypeScript
 */

export const decompSchema = z.object({
  exports: z.array(
    z.object({
      name:z.string().describe('The name of the exported declaration'),
      //lineStart: z.number().describe('Approximate line number where the component export definition starts'),
      //type:z.enum(tsCompTypes),
      type:z.string().describe(`The type of the exported TypeScript declaration, one of ${tsCompStr}`),
      //lineEnd: z.number().describe('Approximate line number where the component export definition ends'),
    }).describe('The object description of the exported declaration')
  ).describe(`Array of exported TypeScript descriptions`)
});


// Base parameter schema used in both functions and methods
export const parameterSchema = z.object({
  name: z.string().describe("Parameter name as it appears in the signature"),
  type: z.string().describe("TypeScript type of the parameter"),
  description: z.string().describe("Purpose and usage of this parameter"),
  defaultValue: z.string().optional().describe("Default value if parameter is optional"),
  isOptional: z.boolean().describe("Whether this parameter can be omitted"),
  isRest: z.boolean().describe("Whether this is a rest parameter (...args)")
});
export type Parameter = z.infer<typeof parameterSchema>;

// Type parameter schema (for generics)
export const typeParameterSchema = z.object({
  name: z.string().describe("Name of the type parameter"),
  constraint: z.string().optional().describe("Type constraint (extends X)"),
  default: z.string().optional().describe("Default type if not specified")
});
export type TypeParameter = z.infer<typeof typeParameterSchema>;

// Exception schema
export const exceptionSchema = z.object({
  type: z.string().describe("Type of the exception that can be thrown"),
  description: z.string().describe("Description of the exception"),
  conditions: z.string().describe("When/why this exception is thrown")
});
export type Exception = z.infer<typeof exceptionSchema>;

// Base component schema with common fields
export const baseComponentSchema = z.object({
  //type: z.enum(['class', 'function', 'interface', 'type', 'constant', 'enum'])
  type: z.enum(tsCompTypes)
    .describe("Type of code component"),
  name: z.string().describe("Name of the component"),
  description: z.string().describe("Detailed description of what this component does and its purpose"),
  isExported: z.boolean().describe("Whether this component is exported from its module"),
  filePath: z.string().describe("Path to the file containing this component"),
  sourceCode: z.string().describe("Source code of the component declaration and signature"),
  jsdoc: z.string().optional().describe("JSDoc comment if present in the source"),
  visibility: z.enum(['public', 'protected', 'private', 'internal'])
    .describe("Visibility/access level of this component"),
  decorators: z.array(z.object({
    name: z.string().describe("Name of the decorator"),
    arguments: z.array(z.string()).optional().describe("Arguments passed to the decorator")
  })).optional().describe("Decorators applied to this component"),
  modulePath: z.string().describe("Import path for this module"),
  dependencies: z.array(z.string()).optional()
    .describe("Other components this component depends on")
});
export type BaseComponent = z.infer<typeof baseComponentSchema>;

// Function signature schema
export const functionSignatureSchema = z.object({
  parameters: z.array(parameterSchema)
    .describe("Parameters accepted by this function signature"),
  returnType: z.string().describe("TypeScript type that this function returns"),
  returnDescription: z.string()
    .describe("Semantic description of what the return value represents and how it's used"),
  typeParameters: z.array(typeParameterSchema).optional()
    .describe("Generic type parameters for this function"),
  throwsExceptions: z.array(exceptionSchema).optional()
    .describe("Exceptions that can be thrown by this function")
});
export type FunctionSignature = z.infer<typeof functionSignatureSchema>;

// Function component schema
export const functionComponentSchema = baseComponentSchema.extend({
  type: z.literal('function').describe("This is a function component"),
  signatures: z.array(functionSignatureSchema)
    .describe("All available signatures for this function (for overloaded functions)"),
  isAsync: z.boolean().describe("Whether this is an async function"),
  isGenerator: z.boolean().describe("Whether this is a generator function"),
  examples: z.array(z.string()).describe("Example code showing how to use this function"),
  usage: z.string().describe("Common usage patterns and best practices"),
  //complexity: z.string().optional().describe("Time/space complexity if applicable")
});

export type FunctionComponent = z.infer<typeof functionComponentSchema>;