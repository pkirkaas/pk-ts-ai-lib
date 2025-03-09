/**
 * Zod/JSON schemas for TS Code Analysis
 * Optimized for use with Vercel AI SDK's generateObject function
 */
// NPM Imports
import "zod-metadata/register";
import { z } from 'zod';
// Local Imports
import { tsCompTypes, } from '../init.js';
// Exports
/**
 * Kinds of components exported by TypeScript
 */
export const decompSchema = z.object({
    exports: z.array(z.object({
        name: z.string().describe('Name of the exported declaration'),
        type: z.string().describe('Type of the exported TypeScript declaration (function, class, interface, etc.)'),
    }).describe('Exported declaration details')).describe('List of exported TypeScript declarations')
});
// Example for the AI model to understand the expected structure
export const decompSchemaExample = {
    exports: [
        { name: "fetchData", type: "function" },
        { name: "UserInterface", type: "interface" },
        { name: "ApiClient", type: "class" }
    ]
};
// Base parameter schema used in both functions and methods
export const parameterSchema = z.object({
    name: z.string().describe("Parameter name as it appears in the signature"),
    type: z.string().describe("TypeScript type of the parameter"),
    description: z.string().describe("Purpose and usage of this parameter"),
    defaultValue: z.string().optional().describe("Default value if parameter is optional"),
    isOptional: z.boolean().describe("Whether this parameter can be omitted"),
    isRest: z.boolean().describe("Whether this is a rest parameter (...args)")
});
// Example for the AI model
export const parameterExample = {
    name: "options",
    type: "RequestOptions",
    description: "Configuration options for the API request",
    defaultValue: "{}",
    isOptional: true,
    isRest: false
};
// Type parameter schema (for generics)
export const typeParameterSchema = z.object({
    name: z.string().describe("Name of the type parameter"),
    constraint: z.string().optional().describe("Type constraint (extends X)"),
    default: z.string().optional().describe("Default type if not specified")
});
// Example for the AI model
export const typeParameterExample = {
    name: "T",
    constraint: "Record<string, any>",
    default: "unknown"
};
// Exception schema
export const exceptionSchema = z.object({
    type: z.string().describe("Type of the exception that can be thrown"),
    description: z.string().describe("Description of the exception"),
    conditions: z.string().describe("When/why this exception is thrown")
});
// Example for the AI model
export const exceptionExample = {
    type: "ApiError",
    description: "Error returned from the API service",
    conditions: "Thrown when the API returns a non-200 status code or when the network request fails"
};
// Base component schema with common fields
export const baseComponentSchema = z.object({
    type: z.enum(tsCompTypes)
        .describe("Type of code component (function, class, interface, etc.)"),
    name: z.string().describe("Name of the component"),
    description: z.string().describe("Description of what this component does"),
    isExported: z.boolean().describe("Whether this component is exported"),
    filePath: z.string().describe("Path to the file containing this component"),
    sourceCode: z.string().describe("Source code signature"),
    jsdoc: z.string().optional().describe("JSDoc comment if present"),
    visibility: z.enum(['public', 'protected', 'private', 'internal'])
        .describe("Visibility level"),
    decorators: z.array(z.object({
        name: z.string().describe("Decorator name"),
        arguments: z.array(z.string()).optional().describe("Decorator arguments")
    })).optional().describe("Applied decorators"),
    modulePath: z.string().describe("Import path"),
    dependencies: z.array(z.string()).optional()
        .describe("Dependencies")
});
// Example for the AI model
export const baseComponentExample = {
    type: "function",
    name: "fetchUserData",
    description: "Retrieves user data from the API",
    isExported: true,
    filePath: "src/api/users.ts",
    sourceCode: "export async function fetchUserData(userId: string): Promise<UserData> { ... }",
    jsdoc: "/**\n * Fetches user data from the API\n * @param userId - The ID of the user\n * @returns User data object\n */",
    visibility: "public",
    decorators: [{ name: "Cached", arguments: ["60000"] }],
    modulePath: "@/api/users",
    dependencies: ["UserData", "apiClient"]
};
// Function signature schema
export const functionSignatureSchema = z.object({
    parameters: z.array(parameterSchema)
        .describe("Function parameters"),
    returnType: z.string().describe("Return type"),
    returnDescription: z.string()
        .describe("Description of the return value"),
    typeParameters: z.array(typeParameterSchema).optional()
        .describe("Generic type parameters"),
    throwsExceptions: z.array(exceptionSchema).optional()
        .describe("Possible exceptions")
});
// Example for the AI model
export const functionSignatureExample = {
    parameters: [
        {
            name: "userId",
            type: "string",
            description: "Unique identifier for the user",
            isOptional: false,
            isRest: false
        },
        {
            name: "options",
            type: "FetchOptions",
            description: "Optional configuration for the request",
            defaultValue: "{}",
            isOptional: true,
            isRest: false
        }
    ],
    returnType: "Promise<UserData>",
    returnDescription: "User data object containing profile information",
    typeParameters: [
        {
            name: "T",
            constraint: "UserData",
            default: "UserData"
        }
    ],
    throwsExceptions: [
        {
            type: "NotFoundError",
            description: "User not found exception",
            conditions: "Thrown when the specified user ID doesn't exist"
        }
    ]
};
// Function component schema
export const functionComponentSchema = baseComponentSchema.extend({
    type: z.literal('function').describe("Function component"),
    signatures: z.array(functionSignatureSchema)
        .describe("Function signatures (for overloads)"),
    isAsync: z.boolean().describe("Is async function"),
    isGenerator: z.boolean().describe("Is generator function"),
    examples: z.array(z.string()).describe("Usage examples"),
    usage: z.string().describe("Usage patterns and best practices")
});
// Example for the AI model
export const functionComponentExample = {
    ...baseComponentExample,
    type: "function",
    signatures: [functionSignatureExample],
    isAsync: true,
    isGenerator: false,
    examples: [
        "const userData = await fetchUserData('user123');",
        "const userData = await fetchUserData('user123', { cache: false });"
    ],
    usage: "Use this function when you need to retrieve user data from the API. Cache results when appropriate."
};
//# sourceMappingURL=zodTsSchemas.js.map