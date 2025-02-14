/** Sigh. HF has it's own API & JS Client - not OpenAI's. */
export declare const hfModels: {
    gemma22b: string;
    llama318b: string;
    qwen2_5_72b: string;
    llama3170b: string;
    phi3mini4k: string;
};
import { HfInference } from "@huggingface/inference";
export declare const hf: HfInference;
export declare let defaultContent: string;
export declare let defaultSystem: string;
export declare function hfChat(content?: string, model?: any): Promise<import("@huggingface/tasks").ChatCompletionOutput>;
//# sourceMappingURL=hflib.d.ts.map