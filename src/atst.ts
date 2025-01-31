/** Super temp tst */


import { openai, createOpenAI, } from "@ai-sdk/openai";

import { typeOf, allProps, allPropsWithTypes, objInfo, getObjDets,
} from 'pk-ts-node-lib';

let topenai = createOpenAI({name:"OpenAIX"});
let anal = {
  typeOf,
  allProps,
//  allPropsWithTypes,
//  objInfo,
//  getObjDets,
};

console.log("In STT, ");
/*
for (let key in anal) {
  let fnc = anal[key];
  let res = fnc(openai);
  console.log(`\n\nAnalyze openai w. [${key}]`,res);
}
  */

//let oaip = allProps(openai,{depth:3});
//let oaip = allProps(topenai,'tvp', 3);
//let oaip = getObjDets(topenai);
let oaip = objInfo(topenai);

console.log(`dets for topenai`, oaip);




//console.log("In STT, ", {openai});