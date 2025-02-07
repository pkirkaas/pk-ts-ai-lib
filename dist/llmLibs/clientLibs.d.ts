import { CoreUserMessage, CoreSystemMessage, CoreAssistantMessage, CoreToolMessage } from 'ai';
import { z } from 'zod';
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createTogetherAI } from '@ai-sdk/togetherai';
import { createXai } from '@ai-sdk/xai';
import { GenObj } from 'pk-ts-node-lib';
import { ModelListOpts, Strings } from '../init.js';
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
export type SdkMessage = CoreUserMessage | CoreSystemMessage | CoreAssistantMessage | CoreToolMessage;
export type SdkMessages = SdkMessage[];
export interface GetModelParams {
    filter: Strings;
}
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
    followupCnt: number;
    divider: string;
    logInited: boolean;
    title: string;
    constructor({ provider, modelName, chatConfig, uMsg, sMsg, msgKeys, outPath }: {
        provider: any;
        modelName: any;
        chatConfig?: {};
        uMsg: any;
        sMsg: any;
        msgKeys?: any[];
        outPath?: string;
    });
    initFile(args?: any): void;
    /**
     * Write message to log file - type "user" or "assistant"
     */
    wrtUsr(msg: string): void;
    wrtAssistant(msg: string): void;
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
    get sdkClient(): any;
    get providerConfig(): GenObj;
    nativeChat(msg: any): Promise<void>;
    /**
     * Possibly interactive method to set this.modelName & return the model name, based on provider & params
     * @param filter?:Strings - filters for model names, or one of 'current' , 'default', 'all',
     */
    getModelName(filter?: Strings): Promise<string>;
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
    singleSdkChat(messages: SdkMessages, temperature: number, modelName: string): Promise<import("ai").GenerateTextResult<import("ai").ToolSet, never>>;
    /**
     * Interactive multi-turn chat using non-interactive singleSdkChat
     */
    sdkChat(msgs: Strings, modelName?: string, temperature?: number): Promise<SdkMessages>;
    /**
     * Generate an object from
     */
    sdkObject(msgs: Strings, schema: z.ZodType, modelName?: string): Promise<any>;
    /**
     * Returns the models available for the provider
     */
    getModels(...args: any[]): Promise<GenObj[]>;
    getRawModels(...args: any[]): Promise<GenObj[]>;
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names, or 'all' or empty for all
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
}
export declare class ClaudeClient extends BaseClient {
}
/**
 * Uses OpenAI API client, but custom methods/implementations
 */
export declare class TogetherClient extends BaseClient {
    getModels(...args: any[]): Promise<GenObj[]>;
}
export declare const clientClasses: {
    OpenAiClient: typeof OpenAiClient;
    ClaudeClient: typeof ClaudeClient;
    TogetherClient: typeof TogetherClient;
};
export declare function getPkClientClass(provider: any): any;
/**
 *
 */
export declare function getPkClient(provider: string): any;
//# sourceMappingURL=clientLibs.d.ts.map