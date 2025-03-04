/**
 * Test various Zod schemas
 */
import "zod-metadata/register";
import { z } from 'zod';
import { Strings } from 'pk-ts-node-lib';
export interface StructureSpec {
    name?: string;
    definition: string;
    schema: z.Schema;
    examples?: any[];
}
export declare const FunctionNamesSchema: z.ZodObject<{
    functionNames: z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">;
}, "strip", z.ZodTypeAny, {
    functionNames?: string[];
}, {
    functionNames?: string[];
}>;
export declare const tstZods: {
    fncNames: z.ZodObject<{
        functionNames: z.ZodArray<z.ZodEffects<z.ZodString, string, string>, "many">;
    }, "strip", z.ZodTypeAny, {
        functionNames?: string[];
    }, {
        functionNames?: string[];
    }>;
};
export declare function tstZodSchemas(keyx?: Strings): import("pk-ts-node-lib").GenericObject;
//# sourceMappingURL=zod-schemas.d.ts.map