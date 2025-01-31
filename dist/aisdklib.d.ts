/**
 * Implementation of the AISDK library from Vercel - provider agnostic
 * abstraction layer for AI services.
 */
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createTogetherAI } from '@ai-sdk/togetherai';
import { createXai } from '@ai-sdk/xai';
import { GenObj } from 'pk-ts-node-lib';
export declare const aiSdkClients: {
    togetherai: {
        client: import("@ai-sdk/togetherai").TogetherAIProvider;
        create: typeof createTogetherAI;
    };
    openai: {
        client: import("@ai-sdk/openai").OpenAIProvider;
        create: typeof createOpenAI;
    };
    anthropic: {
        client: import("@ai-sdk/anthropic").AnthropicProvider;
        create: typeof createAnthropic;
    };
    xai: {
        client: import("@ai-sdk/xai").XaiProvider;
        create: typeof createXai;
    };
};
/**
 * Abstracting all
 */
export declare class AiSdk {
    client: any;
    provider: string;
    chatPath?: string;
    get providerConfig(): GenObj;
    createClient(opts?: GenObj): any;
    constructor(provider: any, opts?: GenObj);
    getModels(...args: any[]): Promise<GenObj>;
}
//# sourceMappingURL=aisdklib.d.ts.map