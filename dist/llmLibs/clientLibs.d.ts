import { CoreMessage } from 'ai';
import { z } from 'zod';
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createTogetherAI } from '@ai-sdk/togetherai';
import { createXai } from '@ai-sdk/xai';
import { createGroq } from '@ai-sdk/groq';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { GenObj } from 'pk-ts-node-lib';
import { ModelListOpts, Strings, BuiltMsg, StructureSpec } from '../init.js';
export declare function detectImageFormat(imageData: Uint8Array): Promise<string>;
export declare const aiSdkClients: {
    togetherai: {
        client: import("@ai-sdk/togetherai").TogetherAIProvider;
        create: typeof createTogetherAI;
    };
    openai: {
        client: import("@ai-sdk/openai").OpenAIProvider;
        create: typeof createOpenAI;
    };
    groq: {
        client: import("@ai-sdk/groq").GroqProvider;
        create: typeof createGroq;
    };
    anthropic: {
        client: import("@ai-sdk/anthropic").AnthropicProvider;
        create: typeof createAnthropic;
    };
    xai: {
        client: import("@ai-sdk/xai").XaiProvider;
        create: typeof createXai;
    };
    lms: {
        create: typeof createOpenAICompatible;
    };
    nebius: {
        create: typeof createOpenAICompatible;
    };
    openrouter: {
        create: typeof createOpenRouter;
    };
};
/**
 * Interface for chat parameters, extending OpenAI's ChatCompletionCreateParams
 */
export interface SdkChatParams {
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    max_tokens?: number;
    [key: string]: any;
}
export declare const defaultSdkChatParams: SdkChatParams;
export interface GetModelParams {
    filter: Strings;
}
export type SdkObjectParams = {
    msgs: Strings;
    schema: z.ZodSchema;
    output?: "object" | "array";
};
/**
 * Log chats - to file and/or DB
 */
export declare class ChatLogger {
    provider: string;
    modelName: string;
    uMsg: string;
    msgKeys: string[];
    chatConfig: GenObj;
    sMsg: string;
    stamp: string;
    outPath: string;
    label: string;
    chatinfo: string;
    chatType: string;
    followupCnt: number;
    divider: string;
    logInited: boolean;
    title: string;
    constructor({ client, chatConfig, uMsg, sMsg, msgKeys, chatType, outPath }: {
        client: any;
        chatConfig?: {};
        uMsg: any;
        sMsg: any;
        msgKeys?: any[];
        chatType?: string;
        outPath?: string;
    });
    initFile(args?: any): void;
    /**
     * Write message to log file - type "user" or "assistant"
     */
    wrtUsr(msg: string): void;
    wrtAssistant(msg: string, dets?: any): void;
}
/**
 * Abstract Client class to provide common interface to different API clients -
 * Base/Default to OpenAI
 * Override for Anthropic, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export declare abstract class BaseClient {
    client: GenObj;
    provider: string;
    chatFilePath: string;
    temperature: number;
    modelName: string;
    constructor(provider: string);
    createNativeClient(...args: any[]): import("pk-ts-node-lib").GenericObject;
    /**
     * Make parameters for ai-sdk - from sdk default, provider default, & specific
     * ai-sdk params are camelCased - convert
     * Which priority?
     */
    mkSdkChatParams(params?: SdkChatParams): SdkChatParams;
    get sdkClient(): any;
    get providerConfig(): GenObj;
    /**
     * To take uMsg tags & build uMsg & sMsg to call nativeChat
     * Can take 'ASK' param to force interactive ask for usr msg
     * TODO? Should extract filter & get model here, or nativeChat
     */
    nativeChat(msgs: Strings, params?: GenObj): Promise<any>;
    /** Placeholder to test generating images */
    imgGen(...args: any[]): Promise<any>;
    nativeChatBuilt(params: {
        bMsg: BuiltMsg;
        [key: string]: any;
    }): Promise<any>;
    /**
     * Possibly interactive method to set this.modelName & return the model name, based on provider & params
     * @param mnfilters?:Strings - filters for model names, or one of 'current' , 'default', 'all',
     */
    getModelName({ mnfilters }: {
        mnfilters: any;
    }): Promise<string>;
    /**
     * Array of model objects to string array of model names
     */
    modelObjsToNames(models: any[]): string[];
    /**
     * Returns single chat response as object w. keys:
     * text:string - the text response
     * toolCalls
     * toolResults
     * finishReason
     * usage
     * warnings
     * request
     * response
     * steps
     *
     */
    singleSdkChat(messages: CoreMessage[], modelName: string, sdkChatParams?: SdkChatParams): Promise<any>;
    prepChat(msgs: Strings, ASK?: boolean): Promise<BuiltMsg>;
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    sdkChat(params: {
        msgs: Strings;
        mnfilters?: Strings;
        sdkChatParams: SdkChatParams;
    }): Promise<CoreMessage[]>;
    mkChatLog({ chatType, uMsg, sMsg, msgKeys, chatConfig }: {
        chatType?: string;
        uMsg?: string;
        sMsg?: string;
        msgKeys?: any[];
        chatConfig?: {};
    }): ChatLogger;
    sdkChatBuilt(params: {
        bMsg: BuiltMsg;
        mnfilters?: Strings;
        sdkChatParams: SdkChatParams;
    }): Promise<CoreMessage[]>;
    /**
     * @deprecated for now - sdk generateObject schema changed - FIX!!
     * Generate an object from input messages & schema
     * @param spec:StructureSpec - The schema & definition for the object returned
     * @param msgx:Strings - The messages to ask the user for input
     * TODO: Add 'output' option to return array of objects
     * TODO: Add ProviderOptions param to allow for provider-specific options - temperature, etc
     */
    sdkObject(spec: StructureSpec, msgx: Strings, mnfilters?: Strings, providerOptions?: GenObj): Promise<any>;
    /**
     * @deprecated for now - sdk generateObject schema changed - FIX!!
     * Test decomp of TS Source Code file
     */
    sdkTsDecomp(fpath?: string, mnfilters?: Strings, providerOptions?: GenObj): Promise<any>;
    /**
     * Returns the models available for the provider
     */
    getModels(...args: any[]): Promise<GenObj[]>;
    getRawModels(...args: any[]): Promise<GenObj[]>;
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.mnfilters?:Strings - substring(s) to filter model names, or 'all' or empty for all
     * @param opts.created?:string|number|GenObj|boolean|null - only models after offset -
     *    true: 90 days
     *    string|number - number of days
     *    GenObj - A date-fns Duration object {days, hours, minutes, months, seconds, years}
     * @param opts.format?:any - format models? - Currently, just format created date
     * @param opts.sort?:string - sort by ModelObject key
     * @param opts.type?:string - filter by ModelObject 'type' key - like 'chat'
     * @return Array of Model Objects
     */
    filterModels(opts?: ModelListOpts): Promise<GenObj[]>;
}
/**
 * The default pk client
 */
export declare class OpenAiClient extends BaseClient {
    nativeChatBuilt(params: {
        bMsg: BuiltMsg;
        mnfilters?: Strings;
        [key: string]: any;
    }): Promise<any>;
}
export declare class ClaudeClient extends BaseClient {
    nativeChatBuilt(params: {
        bMsg: BuiltMsg;
        [key: string]: any;
    }): Promise<any>;
    /**
   * Extracts usage information from the Anthropic API response
   * @param response - The response from the Anthropic API
   * @returns An object containing token usage information
   */
    extractUsageInfo(response: GenObj): GenObj;
    /**
   * Extracts the assistant's response content from the Anthropic API response
   * @param response - The response from the Anthropic API
   * @returns The text content of the assistant's response
   */
    extractAssistantResponse(response: GenObj): string;
}
/**
 * Uses OpenAI API client, but custom methods/implementations
 */
export declare class TogetherClient extends BaseClient {
    getModels(...args: any[]): Promise<GenObj[]>;
}
export declare class OpenRouterClient extends BaseClient {
    imgGen(...args: any[]): Promise<string>;
    /** Special - writes openrouter models to
     * "C:/www/NodeTests/NextTests/json-table/src/data/openrouter-models.ts"
     */
    filterModels(...args: any[]): Promise<GenObj[]>;
    getModels(...args: any[]): Promise<GenObj[]>;
}
export declare const clientClasses: {
    OpenAiClient: typeof OpenAiClient;
    ClaudeClient: typeof ClaudeClient;
    TogetherClient: typeof TogetherClient;
    OpenRouterClient: typeof OpenRouterClient;
};
export declare function getPkClientClass(provider: any): any;
/**
 *
 */
export declare function getPkClient(provider: string): any;
export type SdkFileMsg = {
    content: {
        type: string;
        data: string;
        mimeType: string;
    };
    role: string;
};
/** Returns a message file object to insert in the message array
 * @deprecated - until fixed
*/
export declare function sdkFileMsgFPart(fpath: string, role?: string): CoreMessage;
/**
 * Just try wrapCodeFiles - works
 */
export declare function sdkFileMsg(fpath: string, role?: string): CoreMessage;
//# sourceMappingURL=clientLibs.d.ts.map