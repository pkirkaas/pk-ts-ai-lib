import { GenObj } from 'pk-ts-node-lib';
export declare function fncNameMsg(fncName: string): string;
export declare function populateBody({ provider, model, fncName, }: {
    provider: any;
    model: any;
    fncName: any;
}): Promise<any>;
/**
 * Populate the bodies of all functions in the common-operations.ts file
 */
export declare function populateBodies({ provider, model, }?: GenObj): Promise<string>;
//# sourceMappingURL=index.d.ts.map