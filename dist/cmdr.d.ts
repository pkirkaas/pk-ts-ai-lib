/**
 * Use Commander for CLI script
 */
import { z } from 'zod';
export declare const StringArraySchema: z.ZodArray<z.ZodString, "many">;
export declare const FuncSigSchema: z.ZodObject<{
    functionName: z.ZodString;
    functionSignatures: z.ZodArray<z.ZodString, "many">;
}, "strict", z.ZodTypeAny, {
    functionName?: string;
    functionSignatures?: string[];
}, {
    functionName?: string;
    functionSignatures?: string[];
}>;
//# sourceMappingURL=cmdr.d.ts.map