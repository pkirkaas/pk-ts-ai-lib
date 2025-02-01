import { GenObj } from 'pk-ts-node-lib';
import { ModelListOpts } from '../init.js';
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
    constructor(provider: string);
    createNativeClient(...args: any[]): void;
    get sdkClient(): GenObj;
    get providerConfig(): GenObj;
    baseChat(msg: any): Promise<void>;
    /**
     * Returns the models available for the provider
     */
    getModels(...args: any[]): Promise<GenObj[]>;
    getRawModels(...args: any[]): Promise<GenObj[]>;
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names
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