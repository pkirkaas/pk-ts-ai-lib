/**
 * Claude AI Chat functions
 */

// NPM Imports
import Anthropic from '@anthropic-ai/sdk';
import _ from 'lodash';

//PkLib Imports
import {
  getFilePaths, slashPath, dbgWrt, ask, runCli, sassMapStringToJson, sassMapStringToObj, saveData, isFile, getOsType, isWindows, isLinux, runCommand, stdOut, winBashes,  writeData,  askConfirm, dtFmt, JSON5Stringify, isEmpty, multiAsk,
  parseArgs,
} from 'pk-ts-node-lib';

// Local Imports

import {
   getProviderConfig,  getLlmProvider,
   defaultSysMsg, Strings, logEntities, LogItem, initChatLog,
  chatEntities, ChatLog, ChatItem,
} from './init.js';

export interface AnthropicConfig {
  system?: string,
  temperature?: number,
  max_tokens?: number,
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