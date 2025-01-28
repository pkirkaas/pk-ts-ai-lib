/**
 * Abstract Client class to provide common interface to different API clients - OpenAI & Anthropic for now, maybe Vertex, LMS, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export declare abstract class BaseClient {
    client: object;
    provider: string;
    chatFilePath: string;
    constructor(provider: string);
    baseChat(msg: any): Promise<void>;
    getModels(...args: any[]): Promise<void>;
}
export declare class OpenAiClient extends BaseClient {
    constructor(provider: string);
}
export declare class ClaudeClient extends BaseClient {
}
//# sourceMappingURL=clientLibs.d.ts.map