This is the task: I want a JavaScript function that takes a very long string which is a response from an AI Chatbot, in `Markdown` format. This string may contain regular text, and multiple code blocks for different programming languages. There may be multiple code blocks for the same language. The language code blocks may be intermixed with other code blocks for other languages. Lets assume the languages are `python`, `json`, `typescript`, `javascript`.

The function should return an object keyed with any language code block found in the text. The value of the lang key should be an array with all the code blocks found for that language in the text. We can assume each code block section starts with a newline, triple backticks, and a newline before the actual code.

We can assume each code block is closed by triple backticks on a separate line.

Below is a proposed solution, but I am concerned it is `Greedy Matching` - that is, the matches will include all the text between the first opening language block and the last closing triple backticks. I would like a solution that matches only between an opening code block, and THE FIRST closing block.

Please review the below & respond with a deep, well thought out, robust solution:

```javascript
export function extractCode(resStr) {
  let ret={};
  let langs  = ['javascript', 'python', 'json', 'typescript'];
  let closeStr = '\n```\n';
  for (let lang of langs) {
    let re = new RegExp(`${closeStr}${lang}\n(.*?)\n${closeStr}`, 'gs');
    let matches = resStr.matchAll(re);
    let codeArr = [];
    for (let match of matches) {
      let code = match[1];
      codeArr.push(code);
    }
    if (codeArr.length > 0) {
      ret[lang] = codeArr;
    }
  }
  return ret;
}
```



