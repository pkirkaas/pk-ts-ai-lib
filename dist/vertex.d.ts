/**
 * Use of Google Vertex AI to generate text.
 */
import { Strings } from './init.js';
/**
 * Simple gemini chat - with interactions...
 */
export declare function parseSingleGeminiResponse(result: any): any;
/** TODO - flesh out - use sGeminiChat for now*/
export interface FileContent {
    type: string;
    url: string;
}
export interface GeminiContentsParam {
    text?: Strings;
    inline?: Strings;
    file?: FileContent | FileContent[];
}
/**
 * Make contents portion of Gemini Vertex Request
 * @param msg - string | string[] if just message
 * GeminiContentsParam if want to include file data
 */
export declare function mkGeminiRequest(msg: string | string[] | GeminiContentsParam): Promise<{
    contents: {
        role: string;
        parts: any[];
    }[];
}>;
//# sourceMappingURL=vertex.d.ts.map