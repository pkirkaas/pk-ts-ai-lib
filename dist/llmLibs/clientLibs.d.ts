import { GenObj } from 'pk-ts-node-lib';
import { ModelListOpts } from '../init.js';
/**
 * Abstract Client class to provide common interface to different API clients - OpenAI & Anthropic for now, maybe Vertex, LMS, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export declare abstract class BaseClient {
    client: GenObj;
    provider: string;
    chatFilePath: string;
    constructor(provider: string);
    get providerConfig(): GenObj;
    baseChat(msg: any): Promise<void>;
    /**
     * Returns the models available for the provider
     */
    getModels(...args: any[]): Promise<GenObj[]>;
    /**
     * Returns the models for the provider, optionally filtered/processed:
     * @param opts.filter?:Strings - substring(s) to filter model names
     * @param opts.format?:any - format models? - Currently, just format created date
     * @param opts.sort?:string - sort by ModelObject key
     * @return Array of Model Objects
     */
    filterModels(opts?: ModelListOpts): Promise<GenObj[]>;
}
export declare class OpenAiClient extends BaseClient {
    constructor(provider: string);
    getModels(...args: any[]): Promise<GenObj[]>;
}
export declare class ClaudeClient extends BaseClient {
}
//# sourceMappingURL=clientLibs.d.ts.map