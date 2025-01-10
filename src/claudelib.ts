/**
 * Claude AI Chat functions
 */

// NPM Imports
import Anthropic from '@anthropic-ai/sdk';
import _ from 'lodash';
//import setTitle from 'console-title';
//import {Message} from '@anthropic-ai/sdk';

//PkLib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes, dbgWrite, writeData, writeFile, askConfirm, dtFmt, JSON5Stringify, isEmpty, multiAsk,
  parseArgs,
} from 'pk-ts-node-lib';

// Local Imports

import {
  mkMsgArr, getProviderConfig, expandMsgs, getLlmProvider,
   defaultSysMsg, Strings, logEntities, LogItem, initChatLog,
  chatEntities, ChatLog, ChatItem, mkStamp, mkLogDets,
} from './init.js';

export interface AnthropicConfig {
  system?: string,
  temperature?: number,
  max_tokens?: number,
}

//export async function anthropicChat(msgs: Strings, opts: AnthropicConfig = {}) {
// Experiment with caching
export async function anthropicChatCached(...args ) {
  let {arr:msgs, opts} = parseArgs(args);
  let {sMsg= 'default',  dropSchema=false, followup} = opts;
  let provider= getLlmProvider('anthropic');
  let providerConfig = getProviderConfig(provider);
  let {model, defaultOpts} = providerConfig;
  let chatconfig:AnthropicConfig =  {...defaultOpts, model};;
  //opts = { ...chatconfig,};
  //let {stamp, usrmsg, sysmsg, outpath, label} = await mkLogDets({provider, model, msgs, sMsg,});
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo,  } = await mkLogDets({chatconfig, provider, model, msgs, sMsg});

//  let system = sysmsg
  let system = [
    {type: 'text',
      text: sysmsg,
      cache_control:{type:"ephemeral"}
    }
  ];


  //let { temperature, system, max_tokens } = { ...chatconfig, ...opts };
  //let { temperature,  max_tokens } = { ...chatconfig, };
  //let content = usrmsg;
  //let messages = [{ role: 'user', content:usrmsg, }];
  let messages:any[] =  [{ 
    role: 'user',
    content:[{
      type: 'text',
      text:usrmsg,
      cache_control:{type:"ephemeral"},
    }]}];
  //let messages = [{ role: 'user', content:usrmsg, cache_control:{type:"ephemeral"} }];
  //chatconfig.messages = messages;
  //@ts-ignore
  chatconfig.system = system;
  let anthropic = new Anthropic({
    apiKey: providerConfig.apiKey,
  });
  //let chatinfo = `[Claude-Chat-${dtFmt('dt')}]\nOpts:\n${JSON5Stringify(opts)}\n`;
  let chatLog = await initChatLog({provider,dropSchema, outpath,model,stamp,label,usrmsg, chatconfig:opts, sysmsg, chatinfo });
  //writeData(`# Claude Chat Session: ${chatinfo}\n\n**Init Usr Msg:**\n${content}\n\n`,outpath);
  //while (!isEmpty(content)) {
  let fcnt = 0;
  while (!isEmpty(usrmsg)) {
    fcnt++;
    let chatparams = {...chatconfig, messages};
    /*
    let chatconfig = {
      model,
      max_tokens,
      system,
      //messages: [{ role: "user", content }],
      //@ts-ignore
      messages,
      temperature,
    }
      */
      //@ts-ignore
    let response = await anthropic.messages.create(chatparams);
    let assistant = parseAnthropicResp(response);
    messages.push({role:'assistant', content:assistant});
    //await chatLog.addChatItem({usrmsg:content, assistant, chatinfo, response, messages});
    await chatLog.addChatItem({usrmsg, assistant, chatinfo, response, messages});
    console.log(`Claude:\n\n${assistant}\n\n`);
    writeData(`\n\n**${provider} Assistant:**\n\n${assistant}\n`, outpath, true);
    usrmsg = await ask(`${provider} chat: Followup?`);
    if (!usrmsg) {
      console.log(`Done`);
      break;
    }
    writeData(`\n\n## Followup ${fcnt}:\n\n**UserMsg:**\n\n${usrmsg}\n`, outpath, true);
    //messages.push({role:'user', content:mkMsgStr(msgs)});
    messages.push({role:'user', 
    content:[{
      type: 'text',
      text:usrmsg,
      cache_control:{type:"ephemeral"},
    }]});
  }
  return messages;
}
export async function anthropicChat(...args ) {
  let {arr:msgs, opts} = parseArgs(args);
  let {sMsg= 'default',  dropSchema=false, followup} = opts;
  let provider= getLlmProvider('anthropic');
  let providerConfig = getProviderConfig(provider);
  let {model, defaultOpts} = providerConfig;
  let chatconfig:AnthropicConfig =  {...defaultOpts, model};;
  //opts = { ...chatconfig,};
  //let {stamp, usrmsg, sysmsg, outpath, label} = await mkLogDets({provider, model, msgs, sMsg,});
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo,  } = await mkLogDets({chatconfig, provider, model, msgs, sMsg});
  let system = sysmsg
  //let { temperature, system, max_tokens } = { ...chatconfig, ...opts };
  //let { temperature,  max_tokens } = { ...chatconfig, };
  //let content = usrmsg;
  let messages = [{ role: 'user', content:usrmsg, }];
  //let messages = [{ role: 'user', content:usrmsg, cache_control:{type:"ephemeral"} }];
  //chatconfig.messages = messages;
  chatconfig.system = system;
  let anthropic = new Anthropic({
    apiKey: providerConfig.apiKey,
  });
  //let chatinfo = `[Claude-Chat-${dtFmt('dt')}]\nOpts:\n${JSON5Stringify(opts)}\n`;
  let chatLog = await initChatLog({provider,dropSchema, outpath,model,stamp,label,usrmsg, chatconfig:opts, sysmsg, chatinfo });
  //writeData(`# Claude Chat Session: ${chatinfo}\n\n**Init Usr Msg:**\n${content}\n\n`,outpath);
  //while (!isEmpty(content)) {
  let fcnt = 0;
  while (!isEmpty(usrmsg)) {
    fcnt++;
    let chatparams = {...chatconfig, messages};
    /*
    let chatconfig = {
      model,
      max_tokens,
      system,
      //messages: [{ role: "user", content }],
      //@ts-ignore
      messages,
      temperature,
    }
      */
      //@ts-ignore
    let response = await anthropic.messages.create(chatparams);
    let assistant = parseAnthropicResp(response);
    messages.push({role:'assistant', content:assistant});
    //await chatLog.addChatItem({usrmsg:content, assistant, chatinfo, response, messages});
    await chatLog.addChatItem({usrmsg, assistant, chatinfo, response, messages});
    console.log(`Claude:\n\n${assistant}\n\n`);
    writeData(`\n\n**${provider} Assistant:**\n\n${assistant}\n`, outpath, true);
    usrmsg = await ask(`${provider} chat: Followup?`);
    if (!usrmsg) {
      console.log(`Done`);
      break;
    }
    writeData(`\n\n---\n\n# Followup ${fcnt}:\n\n**UserMsg:**\n\n${usrmsg}\n`, outpath, true);
    //messages.push({role:'user', content:mkMsgStr(msgs)});
    messages.push({role:'user', content:usrmsg});
  }
  return messages;
}

export async function claudeChatTask(msgs:Strings,opts: AnthropicConfig = {}) { 
  let provider = 'anthropic';
  let providerConfig = getProviderConfig(provider);
  /*
  let optsDefault: AnthropicConfig = {
    temperature: .3,
    max_tokens: 8192,
    system: defaultSysMsg,
  };
  */
  //let { temperature, system, max_tokens } = { ...optsDefault, ...opts };
  opts = { ...(providerConfig.defaultOpts), ...opts };
  let model = providerConfig.model;
  //let content: string = mkMsgStr(msgs);
  let content: string = await expandMsgs(msgs);
  let messages = [{ role: 'user', content }];
  let anthropic = new Anthropic({
    apiKey: providerConfig.apiKey,
  });
  //let createConfig = {...optsDefault, ...opts};
  let response = await anthropic.messages.create({
    ...opts,
    model,
    //@ts-ignore
    messages,
    });
    let assistant = parseAnthropicResp(response);
    let logItem = LogItem.create ({
    response, assistant, opts, model, provider, config:providerConfig, content, messages:content,
    });
    await logItem.save();

    return assistant;
}

export function parseAnthropicResp(response): string {
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