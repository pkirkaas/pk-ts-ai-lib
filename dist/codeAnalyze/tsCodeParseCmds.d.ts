/**
 * Rules/Instructions for ai-sdk generateObject for parsing TS Code Files
 * Uses schemas from zodTsSchemas.ts
 */
import "zod-metadata/register";
import { z } from 'zod';
import { CoreMessage } from 'ai';
export declare const schemaTypeDefs: {
    readonly class: {};
    readonly function: {};
    readonly interface: {};
    readonly type: {};
    readonly variable: {};
    readonly enum: {};
};
export declare const tsCompTypes: readonly [string, ...string[]];
export declare const tsCompStr: string;
export declare const tsExpDef = "entities/symbols/declarations/items";
/**
 * Test messages for sdk generateObject
 */
export declare function mkDecompParams(fpath?: string): {
    messages: CoreMessage[];
    schema: z.ZodObject<{
        exports: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            name?: string;
            type?: string;
        }, {
            name?: string;
            type?: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        exports?: {
            name?: string;
            type?: string;
        }[];
    }, {
        exports?: {
            name?: string;
            type?: string;
        }[];
    }>;
};
export type Role = 'user' | 'assistant' | 'system' | 'tool';
export declare function mkMsgObj(content: any, role?: Role): CoreMessage;
export declare const exportableItems: readonly ["class", "function", "async function", "generator function", "const", "let", "var", "enum", "namespace", "type", "interface", "default", "decorator function", "decorator factory", "class decorator", "method decorator", "property decorator", "parameter decorator", "re-export all", "re-export specific", "re-export alias", "re-export default", "re-export namespace"];
//# sourceMappingURL=tsCodeParseCmds.d.ts.map