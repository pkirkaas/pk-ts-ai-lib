/**
 * Zod/JSON schemas for TS Code Analysis
 */
import "zod-metadata/register";
import { z } from 'zod';
import { SdkMessage } from '../init.js';
/**
 * Kinds of components exported by TypeScript
 */
export declare const tsCompTypes: string[];
export declare const tsCompStr: string;
export declare const decompSchema: z.ZodObject<{
    exports: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        lineStart: z.ZodNumber;
        type: z.ZodString;
        lineEnd: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        name?: string;
        lineStart?: number;
        lineEnd?: number;
    }, {
        type?: string;
        name?: string;
        lineStart?: number;
        lineEnd?: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    exports?: {
        type?: string;
        name?: string;
        lineStart?: number;
        lineEnd?: number;
    }[];
}, {
    exports?: {
        type?: string;
        name?: string;
        lineStart?: number;
        lineEnd?: number;
    }[];
}>;
/**
 * Test messages for sdk generateObject
 */
export declare function mkDecompParams(fpath?: string): {
    messages: SdkMessage[];
    schema: z.ZodObject<{
        exports: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            lineStart: z.ZodNumber;
            type: z.ZodString;
            lineEnd: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            name?: string;
            lineStart?: number;
            lineEnd?: number;
        }, {
            type?: string;
            name?: string;
            lineStart?: number;
            lineEnd?: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        exports?: {
            type?: string;
            name?: string;
            lineStart?: number;
            lineEnd?: number;
        }[];
    }, {
        exports?: {
            type?: string;
            name?: string;
            lineStart?: number;
            lineEnd?: number;
        }[];
    }>;
};
export type Role = 'user' | 'assistant' | 'system' | 'tool';
export declare function mkMsgObj(content: any, role?: Role): SdkMessage;
export declare const parameterSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodString;
    description: z.ZodString;
    defaultValue: z.ZodOptional<z.ZodString>;
    isOptional: z.ZodBoolean;
    isRest: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    type?: string;
    name?: string;
    description?: string;
    defaultValue?: string;
    isOptional?: boolean;
    isRest?: boolean;
}, {
    type?: string;
    name?: string;
    description?: string;
    defaultValue?: string;
    isOptional?: boolean;
    isRest?: boolean;
}>;
export type Parameter = z.infer<typeof parameterSchema>;
export declare const typeParameterSchema: z.ZodObject<{
    name: z.ZodString;
    constraint: z.ZodOptional<z.ZodString>;
    default: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    default?: string;
    name?: string;
    constraint?: string;
}, {
    default?: string;
    name?: string;
    constraint?: string;
}>;
export type TypeParameter = z.infer<typeof typeParameterSchema>;
export declare const exceptionSchema: z.ZodObject<{
    type: z.ZodString;
    description: z.ZodString;
    conditions: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type?: string;
    description?: string;
    conditions?: string;
}, {
    type?: string;
    description?: string;
    conditions?: string;
}>;
export type Exception = z.infer<typeof exceptionSchema>;
export declare const baseComponentSchema: z.ZodObject<{
    type: z.ZodEnum<["class", "function", "interface", "type", "constant", "enum"]>;
    name: z.ZodString;
    description: z.ZodString;
    isExported: z.ZodBoolean;
    filePath: z.ZodString;
    sourceCode: z.ZodString;
    jsdoc: z.ZodOptional<z.ZodString>;
    visibility: z.ZodEnum<["public", "protected", "private", "internal"]>;
    decorators: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        arguments?: string[];
    }, {
        name?: string;
        arguments?: string[];
    }>, "many">>;
    modulePath: z.ZodString;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    type?: "function" | "type" | "class" | "interface" | "constant" | "enum";
    name?: string;
    description?: string;
    isExported?: boolean;
    filePath?: string;
    sourceCode?: string;
    jsdoc?: string;
    visibility?: "public" | "protected" | "private" | "internal";
    decorators?: {
        name?: string;
        arguments?: string[];
    }[];
    modulePath?: string;
    dependencies?: string[];
}, {
    type?: "function" | "type" | "class" | "interface" | "constant" | "enum";
    name?: string;
    description?: string;
    isExported?: boolean;
    filePath?: string;
    sourceCode?: string;
    jsdoc?: string;
    visibility?: "public" | "protected" | "private" | "internal";
    decorators?: {
        name?: string;
        arguments?: string[];
    }[];
    modulePath?: string;
    dependencies?: string[];
}>;
export type BaseComponent = z.infer<typeof baseComponentSchema>;
export declare const functionSignatureSchema: z.ZodObject<{
    parameters: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
        description: z.ZodString;
        defaultValue: z.ZodOptional<z.ZodString>;
        isOptional: z.ZodBoolean;
        isRest: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        name?: string;
        description?: string;
        defaultValue?: string;
        isOptional?: boolean;
        isRest?: boolean;
    }, {
        type?: string;
        name?: string;
        description?: string;
        defaultValue?: string;
        isOptional?: boolean;
        isRest?: boolean;
    }>, "many">;
    returnType: z.ZodString;
    returnDescription: z.ZodString;
    typeParameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        constraint: z.ZodOptional<z.ZodString>;
        default: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        default?: string;
        name?: string;
        constraint?: string;
    }, {
        default?: string;
        name?: string;
        constraint?: string;
    }>, "many">>;
    throwsExceptions: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodString;
        description: z.ZodString;
        conditions: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        description?: string;
        conditions?: string;
    }, {
        type?: string;
        description?: string;
        conditions?: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    parameters?: {
        type?: string;
        name?: string;
        description?: string;
        defaultValue?: string;
        isOptional?: boolean;
        isRest?: boolean;
    }[];
    returnType?: string;
    returnDescription?: string;
    typeParameters?: {
        default?: string;
        name?: string;
        constraint?: string;
    }[];
    throwsExceptions?: {
        type?: string;
        description?: string;
        conditions?: string;
    }[];
}, {
    parameters?: {
        type?: string;
        name?: string;
        description?: string;
        defaultValue?: string;
        isOptional?: boolean;
        isRest?: boolean;
    }[];
    returnType?: string;
    returnDescription?: string;
    typeParameters?: {
        default?: string;
        name?: string;
        constraint?: string;
    }[];
    throwsExceptions?: {
        type?: string;
        description?: string;
        conditions?: string;
    }[];
}>;
export type FunctionSignature = z.infer<typeof functionSignatureSchema>;
export declare const functionComponentSchema: z.ZodObject<z.objectUtil.extendShape<{
    type: z.ZodEnum<["class", "function", "interface", "type", "constant", "enum"]>;
    name: z.ZodString;
    description: z.ZodString;
    isExported: z.ZodBoolean;
    filePath: z.ZodString;
    sourceCode: z.ZodString;
    jsdoc: z.ZodOptional<z.ZodString>;
    visibility: z.ZodEnum<["public", "protected", "private", "internal"]>;
    decorators: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        arguments: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name?: string;
        arguments?: string[];
    }, {
        name?: string;
        arguments?: string[];
    }>, "many">>;
    modulePath: z.ZodString;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, {
    type: z.ZodLiteral<"function">;
    signatures: z.ZodArray<z.ZodObject<{
        parameters: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            type: z.ZodString;
            description: z.ZodString;
            defaultValue: z.ZodOptional<z.ZodString>;
            isOptional: z.ZodBoolean;
            isRest: z.ZodBoolean;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }, {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }>, "many">;
        returnType: z.ZodString;
        returnDescription: z.ZodString;
        typeParameters: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            constraint: z.ZodOptional<z.ZodString>;
            default: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            default?: string;
            name?: string;
            constraint?: string;
        }, {
            default?: string;
            name?: string;
            constraint?: string;
        }>, "many">>;
        throwsExceptions: z.ZodOptional<z.ZodArray<z.ZodObject<{
            type: z.ZodString;
            description: z.ZodString;
            conditions: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            type?: string;
            description?: string;
            conditions?: string;
        }, {
            type?: string;
            description?: string;
            conditions?: string;
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        parameters?: {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }[];
        returnType?: string;
        returnDescription?: string;
        typeParameters?: {
            default?: string;
            name?: string;
            constraint?: string;
        }[];
        throwsExceptions?: {
            type?: string;
            description?: string;
            conditions?: string;
        }[];
    }, {
        parameters?: {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }[];
        returnType?: string;
        returnDescription?: string;
        typeParameters?: {
            default?: string;
            name?: string;
            constraint?: string;
        }[];
        throwsExceptions?: {
            type?: string;
            description?: string;
            conditions?: string;
        }[];
    }>, "many">;
    isAsync: z.ZodBoolean;
    isGenerator: z.ZodBoolean;
    examples: z.ZodArray<z.ZodString, "many">;
    usage: z.ZodString;
    complexity: z.ZodOptional<z.ZodString>;
}>, "strip", z.ZodTypeAny, {
    usage?: string;
    type?: "function";
    name?: string;
    description?: string;
    examples?: string[];
    isExported?: boolean;
    filePath?: string;
    sourceCode?: string;
    jsdoc?: string;
    visibility?: "public" | "protected" | "private" | "internal";
    decorators?: {
        name?: string;
        arguments?: string[];
    }[];
    modulePath?: string;
    dependencies?: string[];
    signatures?: {
        parameters?: {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }[];
        returnType?: string;
        returnDescription?: string;
        typeParameters?: {
            default?: string;
            name?: string;
            constraint?: string;
        }[];
        throwsExceptions?: {
            type?: string;
            description?: string;
            conditions?: string;
        }[];
    }[];
    isAsync?: boolean;
    isGenerator?: boolean;
    complexity?: string;
}, {
    usage?: string;
    type?: "function";
    name?: string;
    description?: string;
    examples?: string[];
    isExported?: boolean;
    filePath?: string;
    sourceCode?: string;
    jsdoc?: string;
    visibility?: "public" | "protected" | "private" | "internal";
    decorators?: {
        name?: string;
        arguments?: string[];
    }[];
    modulePath?: string;
    dependencies?: string[];
    signatures?: {
        parameters?: {
            type?: string;
            name?: string;
            description?: string;
            defaultValue?: string;
            isOptional?: boolean;
            isRest?: boolean;
        }[];
        returnType?: string;
        returnDescription?: string;
        typeParameters?: {
            default?: string;
            name?: string;
            constraint?: string;
        }[];
        throwsExceptions?: {
            type?: string;
            description?: string;
            conditions?: string;
        }[];
    }[];
    isAsync?: boolean;
    isGenerator?: boolean;
    complexity?: string;
}>;
export type FunctionComponent = z.infer<typeof functionComponentSchema>;
//# sourceMappingURL=zodTsSchemas.d.ts.map