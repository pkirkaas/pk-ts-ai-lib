/**
 * Use of Google Vertex AI to generate text.
 */
import { isSimpleObject, PkError, } from 'pk-ts-common-lib';
// Local Imports
import { 
//mkMsgStr,
expandMsgs,
// mkStamp,  mkLogDets,
 } from './init.js';
/**
 * Simple gemini chat - with interactions...
 */
/*
export async function sGeminiChat(...args) {
  let {arr:msgs, opts} = parseArgs(args);
  let {sMsg= 'default',  dropSchema=false, followup,} = opts;
  let provider = 'gemini';
  let config = getProviderConfig(provider);
  let model = config.model;
  //let chatinfo = `[Gemini-Chat-s-${dtFmt('dt')}]`;
  let { stamp, usrmsg, sysmsg, outpath, label, chatinfo } = await mkLogDets({provider, model, msgs, sMsg});
  //let {label, stamp, outpath, usrmsg, sysmsg, } = await mkLogDets({provider, model, msgs, sMsg,});

  let vertexAI = new VertexAI({
    project: config.project,
    location: config.location,
  });
  let systemInstruction = {
      role: 'system',
      parts: [{"text": sysmsg,}]
    };
  let gmodel = vertexAI.getGenerativeModel({
    model,
    systemInstruction,
    generationConfig:config.defaultGenerationConfig,
   });
  let chatLog = await initChatLog({outpath, sysmsg, dropSchema, provider, model, stamp, usrmsg, chatinfo, chatconfig:config.defaultGenerationConfig, label,});
  //writeData(`# Chat Session: ${chatinfo}\n\n**Init Msg:**\n${usrmsg}\n\n`, outpath);
  let chat = await gmodel.startChat({});
  while (true) {
    let result = await chat.sendMessage(usrmsg);
    let response = result.response;
    let assistant = parseSingleGeminiResponse(result);
    await chatLog.addChatItem({usrmsg, assistant, response,});
    stdOut(`\n\nGemini Response:\n${assistant}\n`);
    writeData(`\n**Assistant:**\n${assistant}\n\n`, outpath, true);
    usrmsg = await ask(`${provider} chat: Followup?`, {type:followup,});
    if (!usrmsg) {
      console.log(`Done w. Simple Gemini Chat`);
      break;
    }
    writeData(`\n**Followup:**\n${usrmsg}\n\n`, outpath, true);

  }
}
  */
export function parseSingleGeminiResponse(result) {
    let response = result.response;
    let candidates = response.candidates;
    let cLen = candidates.length;
    if (cLen === 1) {
        let content = candidates[0].content;
        let parts = content.parts;
        let pLen = parts.length;
        if (pLen === 1) {
            return parts[0].text;
        }
        return parts;
    }
    return candidates;
}
;
/**
 * Make contents portion of Gemini Vertex Request
 * @param msg - string | string[] if just message
 * GeminiContentsParam if want to include file data
 */
//export function mkGeminiRequest(msg: string | string[] | GeminiContentsParam) {
export async function mkGeminiRequest(msg) {
    let text = '';
    let parts = [];
    if ((typeof msg === "string") || Array.isArray(msg)) {
        msg = { text: msg };
    }
    if (!isSimpleObject(msg)) {
        throw new PkError(`Invalid msg to mkGeminiContents:`, msg);
    }
    if ('text' in msg) {
        //msg.text = mkMsgStr(msg.text);
        msg.text = await expandMsgs(msg.text);
    }
    parts.push(msg);
    let request = {
        //contents: [{ role: 'user', parts: [{ text: msg }] }],
        contents: [{ role: 'user', parts }],
    };
    return request;
}
//# sourceMappingURL=vertex.js.map