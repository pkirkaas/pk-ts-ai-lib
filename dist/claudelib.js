/**
 * Claude AI Chat functions
 */
//PkLib Imports
import { JSON5Stringify, } from 'pk-ts-node-lib';
export function parseAnthropicResp(response) {
    let contentArr = response.content;
    let len = contentArr.length;
    if (len === 1) {
        let content = contentArr[0];
        if (content.type === 'text') {
            return content.text;
        }
        return JSON5Stringify({ label: "Non-text-content", content });
    }
    return JSON5Stringify({ label: "Multiple-content-array", contentArr });
}
//# sourceMappingURL=claudelib.js.map