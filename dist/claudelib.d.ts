/**
 * Claude AI Chat functions
 */
import { Strings } from './init.js';
export interface AnthropicConfig {
    system?: string;
    temperature?: number;
    max_tokens?: number;
}
/**
 * Cached Claude Chat called from chatBase
 */
export declare function chatClaudeBase(): Promise<void>;
export declare function anthropicChatCached(...args: any[]): Promise<any[]>;
export declare function anthropicChat(...args: any[]): Promise<{
    role: string;
    content: string;
}[]>;
export declare function claudeChatTask(msgs: Strings, opts?: AnthropicConfig): Promise<string>;
export declare function parseAnthropicResp(response: any): string;
//# sourceMappingURL=claudelib.d.ts.map