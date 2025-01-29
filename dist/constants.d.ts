/**
 * Predefined constants & options, like system messages, etc
 */
import { VertexAI } from '@google-cloud/vertexai';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";
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
export declare const providers: {
    lms: {
        baseURL: string;
        apiKey: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
        clientLib: typeof OpenAI;
    };
    grok: {
        apiKey: string;
        clientLib: typeof OpenAI;
        baseURL: string;
        model: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
    };
    ollama: {
        baseURL: string;
        apiKey: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
        clientLib: typeof OpenAI;
    };
    openai: {
        baseURL: string;
        clientLib: typeof OpenAI;
        defaultFilter: string;
        defaultOpts: {
            temperature: number;
            top_p: number;
            frequency_penalty: number;
            presence_penalty: number;
        };
        apiKey: string;
        defaultModel: string;
    };
    together: {
        baseURL: string;
        apiKey: string;
    };
    anthropic: {
        clientLib: typeof Anthropic;
        baseURL: string;
        type: string;
        model: string;
        apiKey: string;
        defaultOpts: {
            max_tokens: number;
            system: string;
            temperature: number;
            top_p: number;
        };
    };
    gengemini: {
        type: string;
        model: string;
        models: string[];
        baseURL: string;
        project: string;
        defaultGenerationConfig: {
            temperature: number;
            top_p: number;
            top_k: number;
            frequency_penalty: number;
            presence_penalty: number;
            maxOutputTokens: number;
            candidateCount: number;
        };
        apiKey: string;
        location: string;
    };
    gemini: {
        type: string;
        clientLib: typeof VertexAI;
        model: string;
        project: string;
        defaultGenerationConfig: {
            temperature: number;
            top_p: number;
            top_k: number;
            frequency_penalty: number;
            presence_penalty: number;
            maxOutputTokens: number;
            candidateCount: number;
        };
        apiKey: string;
        location: string;
    };
    nebius: {
        clientLib: typeof OpenAI;
        baseURL: string;
        apiKey: string;
    };
    nvidia: {
        clientLib: typeof OpenAI;
        baseURL: string;
        apiKey: string;
    };
};
export declare const timeout: number;
//# sourceMappingURL=constants.d.ts.map