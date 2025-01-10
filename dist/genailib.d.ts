/**
 * Use the Google Generative AI API for text generation
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GenObj } from 'pk-ts-common-lib';
import { Strings } from './init.js';
export declare function getGenAIModels(opts?: GenObj): Promise<void>;
export declare function genAIChat(msg?: Strings, opts?: GenObj): Promise<any>;
export declare function getGenAIClient(provider?: string, opts?: GenObj): Promise<GoogleGenerativeAI>;
//# sourceMappingURL=genailib.d.ts.map