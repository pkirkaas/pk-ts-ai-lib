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
};
export declare let anthropicCodeParams: {
    temperature: number;
    top_p: number;
    max_tokens: number;
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
export type ProviderConfig = {
    baseURL?: string;
    apiKey?: string;
    defaultOpts?: GenObj;
    model?: string;
    filters?: Strings;
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