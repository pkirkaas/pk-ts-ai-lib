/**
 * Predefined constants & options, like system messages, etc
 */
import { GenObj, Strings } from 'pk-ts-node-lib';
export declare let LMS_PORT: string;
export declare let OLLAMA_PORT: string;
export declare let oaiCodeParams: {
    temperature: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
    max_tokens: number;
};
export declare let anthropicCodeParams: {
    temperature: number;
    top_p: number;
    max_tokens: number;
    thinking: {
        type: string;
        budget_tokens: number;
    };
};
export declare const defaultGenerationConfig: {
    temperature: number;
    top_p: number;
    top_k: number;
    frequency_penalty: number;
    presence_penalty: number;
    maxOutputTokens: number;
    candidateCount: number;
};
/**
 * Configuration for an LLM provider
 *
 * @property baseURL - Base URL for the provider's API
 * @property apiKey - API key for authentication
 * @property defaultOpts - Default options for API calls
 * @property model - Default model to use
 * @property filters - String or array of strings to filter model names/IDs
 * @property clientLib - Client library to use for API calls
 * @property pkClientClass - Custom client class
 * @property type - Provider type (e.g., "vertex")
 * @property location - Geographic location for the provider
 * @property project - Project ID for the provider
 */
export type ProviderConfig = {
    baseURL?: string;
    apiKey?: string;
    defaultOpts?: GenObj;
    model?: string;
    mnfilters?: string | Strings;
    clientLib?: any;
    pkClientClass?: any;
    type?: string;
    location?: string;
    project?: string;
};
export type Providers = {
    [key: string]: ProviderConfig;
};
export declare const providers: Providers;
export declare const timeout: number;
//# sourceMappingURL=constants.d.ts.map