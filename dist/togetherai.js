/**
 * Library for TogetherAI API compliant operations - not totally OpenAI API compliant
 */
// NPM Package imports
// PK Lib imports
import { dtFmt, PkError, asNumeric, ask, dateToTimestamp, } from 'pk-ts-node-lib';
// Local imports
// Exports
import { getRawModelObjs, filterModelObjArr, } from './init.js';
/**
 * Filters array of TogetherAI models based on the provided filter.
 * @param name:string - filter by substring model name
 * @param date:any - Models created after this date
 * @param type:string - filter by model type (ex: 'chat')
 * @param price:number - max dollars/million tokens
 * @param org:string - filter by organization name
 * @param context:number - filter by model context >= context * 1000
 */
export async function filterTogetherModels({ name, date, type, context, price, org, opts }) {
    let models = await getRawModelObjs('together');
    if (!Array.isArray(models)) {
        throw new PkError(`Models not array:`, { models });
    }
    if (!date) { // Minumum cutoff date
        date = "1 June 2024";
    }
    for (let model of models) {
        let price = model.pricing;
        if (price.hourly || price.base) {
            throw new PkError(`Unexpected pricing:`, { model });
        }
        if (model.object !== 'model') {
            throw new PkError(`Unexpected object:`, { model });
        }
        model.createdDt = dtFmt('short', (model.created * 1000));
    }
    if (date) { // Include models w/o created date
        date = dateToTimestamp(date);
        models = models.filter(model => ((!model.created) || (model.created) >= date));
    }
    if (price) {
        models = models.filter((model) => {
            return (model.pricing.input <= price) && (model.pricing.output <= price);
        });
    }
    if (org) {
        models = models.filter(model => model.organization.toLowerCase() === org.toLowerCase());
    }
    if (name) {
        models = models.filter(model => model.id.toLowerCase().includes(name.toLowerCase()));
    }
    if (context) {
        context = context * 1000;
        models = models.filter(model => model.context_length >= context);
    }
    if (type) {
        models = models.filter(model => model.type == type);
    }
    models = filterModelObjArr(models, opts);
    return models;
}
/**
 * Accepts filters for TogetherAI models, finds models,  and returns array of models matching filters & formatted for inquirer choices
 */
export async function askTogetherModel({ name, date, type, context, price, org, opts, }) {
    let models = await filterTogetherModels({ name, date, type, context, price, org, opts, });
    let choices = mkTogetherModelChoices(models);
    let answer = await ask(`What model to use for TogetherAI?`, { choices });
    return answer;
}
export function showTogetherModels(models) {
    let out = models.map(showTogetherModel);
    return out;
}
export function showTogetherModel(model) {
    /*
    if (model.pricing.output !== model.pricing.input) {
      throw new PkError(`Unexpected pricing:`, { model });
    }
      */
    let out = {
        name: model.id,
        created: dtFmt('short', (model.created * 1000)),
        context: Math.floor(model.context_length / 1000) + 'K',
        price: `inp:${asNumeric(model.pricing.input.toFixed(2))}, out: ${asNumeric(model.pricing.output.toFixed(2))}`,
        /*
        price: {
          input: asNumeric(model.pricing.input.toFixed(2)),
          output: asNumeric(model.pricing.output.toFixed(2))
        },
        */
    };
    return out;
}
export function togetherModelStrDsc(model) {
    let tObj = showTogetherModel(model);
    let dsc = `${tObj.name}: [${tObj.created}]: [${tObj.context}] ${tObj.price}/M`;
    return dsc;
}
/** Choices for inquirer choices array */
export function mkTogetherModelChoice(model) {
    let value = model.id;
    let name = togetherModelStrDsc(model);
    return { name, value };
}
export function mkTogetherModelChoices(models) {
    let choices = models.map(mkTogetherModelChoice);
    return choices;
}
//# sourceMappingURL=togetherai.js.map