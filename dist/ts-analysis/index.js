"use strict";
exports.__esModule = true;
// Exports
/*
export function fncNameMsg(fncName:string) {
  let msg = `Your task is to process and parse the typescript code that follows and just return the function definition/code as described in the system message, ONLY for the function named \`${fncName}\` - remembering to include the function signature and applicable \`TsDoc\` comments. Just return the function definition. The code is:\n` + getCommonTs();
  return msg;
}
  */
/*
export async function populateBody({provider, model, fncName,}) {
  provider = provider || 'lms';
  let config = getProviderConfig(provider);
  model = model || config.model || config.defaultModel || getModelByIdx();
  if (!model || !fncName) {
    throw new Error('Must provide model and fncName');
  }
  let ds = await initFncDets(provider, model);
  let entry = await FunctionDets.fncByName(fncName);
  if (!entry) {
    throw new PkError(`No function named ${fncName}`);
  }
  //let toEntry = typeOf(entry);
  //console.log(`in populateBody: toEntry: [${toEntry}]; entry:`, entry);

  //let model = await askModel(provider);
  let client = getOaiClient(provider);
//  let emptyFncs = await FunctionDets.fncsNoBody();
 // let fncs = await FunctionDets.fncByName(fncName);
  let sMsg = ['ts', 'auto', 'tsfncbody'];
  //let usrMsg = ['tsfncbody', fncNameMsg(fncName), getCommonTs()];
  let uMsg = ['utsfncbody', fncNameMsg(fncName), ];
  //let msgs = mkMsgArr({uMsg, sMsg});
  let msgs = [uMsg, sMsg];
  //console.log(`msgs:`, msgs);
  //return msgs;
  let res = await chatTask({provider, model, msgs});
  entry.body = res;
  await entry.save();
  console.log(`ChatTask body res for ${fncName}:\n`, res);
  return res;
  }
  */
/**
 * Populate the bodies of all functions in the common-operations.ts file
 */
/*
export async function populateBodies({provider, model,}:GenObj={}) {
  provider = provider || 'lms';
  let config = getProviderConfig(provider);
  model = model || config.model || config.defaultModel || getModelByIdx();
  let ds = await initFncDets(provider, model);
  //let emptyFncs = await FunctionDets.fncsNoBody();
  let emptyFncs = await FunctionDets.fncsNoTsBody();
  let efLen = emptyFncs.length;
  //console.log(`About to populate bodies for ${efLen} empty functions: Fncs:`, emptyFncs, {efLen},);
  console.log(`About to populate bodies for ${efLen} empty functions w. provider:[${provider}], model: [${model}]`,);
  //return "Done";
  let cnt = 0;
  for (let entry of emptyFncs) {
    cnt++;
    let fncName = entry.name;
    console.log(`About to populate body for ${fncName} (${cnt}/${efLen})`);
    let res = await populateBody({provider, model, fncName});
  }
  return "Done";
}

*/ 
//# sourceMappingURL=index.js.map