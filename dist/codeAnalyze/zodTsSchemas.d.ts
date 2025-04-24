/**
 * Zod/JSON schemas for TS Code Analysis
 * Optimized for use with Vercel AI SDK's generateObject function
 */
import "zod-metadata/register";
import { z } from 'zod';
/**
 * Kinds of components exported by TypeScript
 */
export declare const decompSchema: z.ZodObject<{
    exports: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type?: string;
        name?: string;
    }, {
        type?: string;
        name?: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    exports?: {
        type?: string;
        name?: string;
    }[];
}, {
    exports?: {
        type?: string;
        name?: string;
    }[];
}>;
export declare const decompSchemaExample: {
    exports: {
        name: string;
        type: string;
    }[];
};
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
export declare const parameterExample: {
    name: string;
    type: string;
    description: string;
    defaultValue: string;
    isOptional: boolean;
    isRest: boolean;
};
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
export declare const typeParameterExample: {
    name: string;
    constraint: string;
    default: string;
};
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
export declare const exceptionExample: {
    type: string;
    description: string;
    conditions: string;
};
export declare const baseComponentSchema: z.ZodObject<{
    type: z.ZodEnum<[string, ...string[]]>;
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
    type?: string;
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
    type?: string;
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
export declare const baseComponentExample: {
    type: string;
    name: string;
    description: string;
    isExported: boolean;
    filePath: string;
    sourceCode: string;
    jsdoc: string;
    visibility: string;
    decorators: {
        name: string;
        arguments: string[];
    }[];
    modulePath: string;
    dependencies: string[];
};
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
export declare const functionSignatureExample: {
    parameters: ({
        name: string;
        type: string;
        description: string;
        isOptional: boolean;
        isRest: boolean;
        defaultValue?: undefined;
    } | {
        name: string;
        type: string;
        description: string;
        defaultValue: string;
        isOptional: boolean;
        isRest: boolean;
    })[];
    returnType: string;
    returnDescription: string;
    typeParameters: {
        name: string;
        constraint: string;
        default: string;
    }[];
    throwsExceptions: {
        type: string;
        description: string;
        conditions: string;
    }[];
};
export declare const functionComponentSchema: z.ZodObject<{
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
} & {
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
}, "strip", z.ZodTypeAny, {
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
}>;
export type FunctionComponent = z.infer<typeof functionComponentSchema>;
export declare const functionComponentExample: {
    type: string;
    signatures: {
        parameters: ({
            name: string;
            type: string;
            description: string;
            isOptional: boolean;
            isRest: boolean;
            defaultValue?: undefined;
        } | {
            name: string;
            type: string;
            description: string;
            defaultValue: string;
            isOptional: boolean;
            isRest: boolean;
        })[];
        returnType: string;
        returnDescription: string;
        typeParameters: {
            name: string;
            constraint: string;
            default: string;
        }[];
        throwsExceptions: {
            type: string;
            description: string;
            conditions: string;
        }[];
    }[];
    isAsync: boolean;
    isGenerator: boolean;
    examples: string[];
    usage: string;
    name: string;
    description: string;
    isExported: boolean;
    filePath: string;
    sourceCode: string;
    jsdoc: string;
    visibility: string;
    decorators: {
        name: string;
        arguments: string[];
    }[];
    modulePath: string;
    dependencies: string[];
};
//# sourceMappingURL=zodTsSchemas.d.ts.map