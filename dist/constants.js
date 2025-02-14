"use strict";
/**
 * Predefined constants & options, like system messages, etc
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.timeout = exports.providers = exports.defaultGenerationConfig = exports.anthropicCodeParams = exports.oaiCodeParams = exports.OLLAMA_PORT = exports.LMS_PORT = void 0;
// Local Imports
var init_js_1 = require("./init.js");
var vertexai_1 = require("@google-cloud/vertexai");
var sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
var openai_1 = __importDefault(require("openai"));
exports.LMS_PORT = process.env.LMS_PORT;
exports.OLLAMA_PORT = process.env.OLLAMA_PORT;
exports.oaiCodeParams = {
    temperature: .1,
    top_p: 0.2,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
};
exports.anthropicCodeParams = {
    temperature: .15,
    top_p: 0.2,
    max_tokens: 8192
};
exports.defaultGenerationConfig = {
    temperature: .15,
    top_p: 0.2,
    top_k: 40,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    //maxOutputTokens: 20000,
    maxOutputTokens: 8192,
    candidateCount: 1
};
exports.providers = {
    lms: {
        baseURL: "http://localhost:" + exports.LMS_PORT + "/v1",
        apiKey: 'lms',
        defaultOpts: __assign({}, exports.oaiCodeParams)
    },
    xai: {
        apiKey: process.env.GROK_API_KEY,
        // clientLib: OpenAI,
        baseURL: "https://api.x.ai/v1",
        model: "grok-beta",
        defaultOpts: __assign({}, exports.oaiCodeParams)
    },
    ollama: {
        baseURL: "http://localhost:" + exports.OLLAMA_PORT + "/v1",
        apiKey: 'ollama',
        defaultOpts: __assign({}, exports.oaiCodeParams)
    },
    openai: {
        baseURL: 'https://api.openai.com/v1',
        // clientLib: OpenAI,
        filters: 'latest',
        defaultOpts: __assign({}, exports.oaiCodeParams),
        apiKey: process.env.OPENAI_API_KEY,
        //model: 'chatgpt-4o-latest',
        model: "gpt-4o-2024-11-20"
    },
    togetherai: {
        baseURL: "https://api.together.xyz/v1",
        apiKey: process.env.TOGETHER_API_KEY,
        pkClientClass: init_js_1.TogetherClient
    },
    anthropic: {
        clientLib: sdk_1["default"],
        pkClientClass: init_js_1.ClaudeClient,
        //baseURL: "",
        //type: "vertex",
        model: 'claude-3-5-sonnet-latest',
        apiKey: process.env.ANTHROPIC_API_KEY,
        defaultOpts: __assign(__assign({}, exports.anthropicCodeParams), { max_tokens: 8192, system: init_js_1.defaultSysMsg })
    },
    gengemini: {
        model: 'gemini-2.0-flash-exp',
        //model: 'gemini-1.5-pro-002',
        filters: [
            'gemini-1.5-pro-exp-0827',
            'gemini-1.5-pro-002',
        ],
        baseURL: "https://generativelanguage.googleapis.com/v1beta",
        project: 'stalwart-veld-438120-v7',
        defaultOpts: __assign({}, exports.defaultGenerationConfig),
        apiKey: process.env.GEMINI_API_KEY,
        location: 'us-central1'
    },
    gemini: {
        type: "vertex",
        clientLib: vertexai_1.VertexAI,
        model: 'gemini-1.5-pro-002',
        project: 'stalwart-veld-438120-v7',
        defaultOpts: __assign({}, exports.defaultGenerationConfig),
        apiKey: process.env.GEMINI_API_KEY,
        location: 'us-central1'
    },
    nebius: {
        clientLib: openai_1["default"],
        baseURL: "https://api.studio.nebius.ai/v1/",
        apiKey: process.env.NEBIUS_API_KEY
    },
    nvidia: {
        clientLib: openai_1["default"],
        baseURL: 'https://integrate.api.nvidia.com/v1',
        apiKey: process.env.NVIDIA_API_KEY
    }
};
exports.timeout = 96 * 60 * 60 * 1000; //96 hour timeout
//# sourceMappingURL=constants.js.map