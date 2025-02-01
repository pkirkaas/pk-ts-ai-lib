/**
 * Library for TogetherAI API compliant operations - not totally OpenAI API compliant
 */
/**
 * Filters array of TogetherAI models based on the provided filter.
 * @param name:string - filter by substring model name
 * @param date:any - Models created after this date
 * @param type:string - filter by model type (ex: 'chat')
 * @param price:number - max dollars/million tokens
 * @param org:string - filter by organization name
 * @param context:number - filter by model context >= context * 1000
 */
export declare function filterTogetherModels({ name, date, type, context, price, org, opts }: any): Promise<any[]>;
/**
 * Accepts filters for TogetherAI models, finds models,  and returns array of models matching filters & formatted for inquirer choices
 */
export declare function askTogetherModel({ name, date, type, context, price, org, opts, }: any): Promise<any>;
export declare function showTogetherModels(models: any): any;
export declare function showTogetherModel(model: any): {
    name: any;
    created: string | false;
    context: string;
    price: string;
};
export declare function togetherModelStrDsc(model: any): string;
/** Choices for inquirer choices array */
export declare function mkTogetherModelChoice(model: any): {
    name: string;
    value: any;
};
export declare function mkTogetherModelChoices(models: any): any;
//# sourceMappingURL=togetherai.d.ts.map