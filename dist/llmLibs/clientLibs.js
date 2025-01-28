/*
export interface AnthropicConfig {
  system?: string,
  temperature?: number,
  max_tokens?: number,
}
  */
/**
 * Abstract Client class to provide common interface to different API clients - OpenAI & Anthropic for now, maybe Vertex, LMS, etc
 * New instance for every new interaction, different providers might use the same API client
 */
export class BaseClient {
    client; // The initialized API Client SDK
    provider; // The provider name for the default provider config, with URL, default opts, etc
    chatFilePath; // The file patch for the specific chat log. Initialized in 'chat' method.
    constructor(provider) {
        this.provider = provider;
    }
    async baseChat(msg) {
    }
    async getModels(...args) {
    }
}
export class OpenAiClient extends BaseClient {
    constructor(provider) {
        super(provider);
    }
}
export class ClaudeClient extends BaseClient {
}
//# sourceMappingURL=clientLibs.js.map