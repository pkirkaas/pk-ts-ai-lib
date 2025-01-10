/**
 * More tests....
 */

// NPM Imports

import path from 'path';
import { Anthropic } from '@anthropic-ai/sdk';
import * as Tst from '@anthropic-ai/sdk';



//PkLib Imports
import {
  packageReport, writeData, slashPath, GenObj, ajvSchema, runCli, multiAsk, stdOut,
} from 'pk-ts-node-lib';


// Local Imports
import {
  mkRepPath, getLogDS, LogItem, wrapCode, getAllFiles, wrapCodeDir,
} from './init.js';

// JSON Imports
import geminiAllProps from './allPropsJsons/GeminiAllProps.json' with {type: "json"};
import claudeAllProps from './allPropsJsons/ClaudeAllProps.json' with {type: "json"};
import oaiAllProps from './allPropsJsons/OAIAllProps.json' with {type: "json"};

import fncSchema from './FncSchemas/fnc2schema.json' with {type: 'json'};


/**
 * Validates JSON schema itself, then the JSON results from OpenAI, Gemini & Claude
 */
export function tstFncJsons() {
  let jsons = { geminiAllProps, claudeAllProps, oaiAllProps };
  console.log(`Validating fncSchema iteself`);
  let validate = ajvSchema(fncSchema);
  console.log(`Schema itself validate, now validate individual jsons`);
  for (let key in jsons) {
    let json = jsons[key];
    if (validate(json)) {
      console.log(`The [${key}] json is valid`);
    } else {
      console.log(`Validation of [${key}] return errors:`);
      console.log(validate.errors);
    }
  }
  console.log(`Validation finished`);
}

export async function tstDbLog() {
  let ds = await getLogDS();
  let data = {
    model: 'TstModel',
    agent: 'Gemini',
    config: { a: "chat-config" },
  };
  let li = LogItem.create(data);
  let res = await li.save();
  return res;
}

// Testing readline for multi-line input
//import { stdin as input, stdout as output } from 'node:process';
//Both promise based & callback/sync based
//import * as readline from 'node:readline/promises';
// OR
//import * as readline from 'node:readline';
//promise based

/*
async function multiLineInput(prompt?:string):Promise<string> {
  if (!prompt) {
    prompt = 'Enter text: ';
  }
  prompt += ' ("exit" or <Ctl-D> to finish)';
  const rl = readline.createInterface({ input, output, terminal:true, });
  let lines = [];
  let exits = ['exit', 'quit', 'q', '.', 'bye', 'done',];
  console.log(prompt);
    return new Promise((resolve, reject) => {
    rl.on('line', (line) => {
      if (exits.includes(line.trim())) {
        rl.close();
        return resolve(lines.join('\n'));
      }
      lines.push(line);
    });

    rl.on('close', () => {
      resolve(lines.join('\n')); // Handle Ctrl-D here
    });

    rl.on('error', (err) => {
      reject(err);
    });
  });
}
*/



let fncs = {
  wrapCodeDir:() => {
    //let root = '.\\';
    let root = "C:/www/TypeScriptLibs/Pk-Ts-Common"
    console.log(`Testing wrapCodeDir on [${root}]`);
    //let res = wrapCodeDir(root);
    let res = wrapCode(root);
    let wdres = writeData(res,'./out/wrappedCode.md');
    console.log(`Done w. wrapCodeDir, wdres:`, {wdres},);
  },
  wrapCode: () => {
    //let fname = './src/lib.ts';

    let root = "Q:/Common/Software-Dev/Pythons/SortFiles";
   // let fname = 'Q:\\Common\\AI-Experiments\\Node\\Sept2024\\Basic-1\\src\\lib.ts';
    //let root = '.';
    //let root = '.\\';
    console.log(`Testing wrapCode on [${root}], root:`, {root});
    let res = wrapCode(root, {root, desc: "Testing wrapCode"});
    //let res = wrapCode(fname);
    stdOut(res);
  },
  getAllFiles: () => {
    //let root = "C:/www/TypeScriptLibs/Pk-Ts-Common"
    //"Q:/Common/Software-Dev/Pythons/SortFiles"
    let root = "Q:/Common/Software-Dev/Pythons/SortFiles";
    //throw new Error('Not implemented');
    //let root = '.\\';
    console.log(`Testing getAllFiles on [${root}]`);
    let res = getAllFiles(root, {stats:true});
    console.log( res);
  },
  tstRL : async (prompt?:string) => {
    if (!prompt) {
      prompt = 'Def Say what?';
    }
    let res = await multiAsk(prompt);
    console.log(`Done w. tstRL, res:`, {res}, 'resOut:',);
    stdOut(res);
  },
  tstDbgLog: async () => {
    console.log(`About to init dbLog`);
    let lgRes = await tstDbLog();
    console.log(`Done w. tstDbLog, res:`, { lgRes });
  },
  tstFncJsons: async() => {
    let res = tstFncJsons();
    console.log(`Done w. tstFncJsons, res:`,{res});
  },
};

await runCli(fncs);



// Testing getting db name from db strings
/*
let tstDbs = [
  'pg_db',
  'mysql-DB',
  'sqlite-db.sqlite',
  'C:\\abs\\a-db.name',
  'C:/abs/b-db.name',
  '/mnt/path/dbname.end',
  './dot/path/pname.none',
  'adir/and/name.some',
];

function getName(db:string) {
  let slashed = slashPath(db);
  let absdb = path.resolve(db);
  let abssl = path.resolve(slashed);
  let base = path.basename(slashed);
  let noext = base.split('.')[0];
  let ret:GenObj = {db, slashed, base, noext, absdb, abssl, };
  return ret;
}

console.log ('Iterating strings\n\n');
for (let astr of tstDbs) {
  let res = getName(astr);
  console.log(res, `\n\n`);
}


let res = packageReport('@anthropic-ai/sdk');
let repPath = mkRepPath('AnthropicExports', 'json5');
writeData(res,repPath);
console.log(res);
 */