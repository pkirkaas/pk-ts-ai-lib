import { extractCode, 
//extractCodeOAI, extractCodeClaude, extractCodeClaude2,
extractCodeC3, } from './init.js';
import { JSON5Stringify, stdOut, } from 'pk-ts-node-lib';
const testString = `
Here's some Python code:
\`\`\`python
def hello_world():
    print("Hello, World!")
    # This is a comment with \`\`\` backticks
\`\`\`

And here's some JavaScript:
\`\`\`JAVASCRIPT
function helloWorld() {
    console.log("Hello, World!");
}
\`\`\`

Empty code block:
\`\`\`python
a = 1
\`\`\`

More Python:
\`\`\`python  
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b
\`\`\`

Some JSON:
\`\`\`json
{
    "name": "John Doe",
    "age": 30,
    "city": "New York"
}
\`\`\`

More javascript, clean this time:
\`\`\`javascript
function add(a,b) {
    return a + b;
}
\`\`\`


Unsupported language:
\`\`\`cpp
int main() {
    return 0;
}
\`\`\`
`;
const testString2 = `
Here's some Python code with triple backticks in a comment:
\`\`\`python
def hello_world():
    print("Hello, World!")
    # This is a comment with \`\`\` backticks
\`\`\`

JavaScript with backticks in a template literal:
\`\`\`javascript
const greeting = \`Hello, \${name}!\`;
console.log(\`Greeting: \${greeting}\`);
\`\`\`

Rust with a raw string containing backticks:
\`\`\`rust
let raw_string = r#"This is a raw string with \`\`\` backticks"#;
println!("{}", raw_string);
\`\`\`

SQL with quoted identifiers using backticks:
\`\`\`sql
SELECT * FROM \`users\` WHERE \`age\` > 18;
\`\`\`

Nested markdown-like structure (not a real code block):
\`\`\`python
def fake_markdown():
    print("This is not a real code block:")
    print("\`\`\`")
    print("Nested content")
    print("\`\`\`")
\`\`\`
`;
let tstStrs = {
    testString,
    testString2,
};
let fncs = {
    //  extractCodeClaude,
    //  extractCodeClaude2,
    extractCodeC3,
    extractCode,
    //  extractCodeOAI,
};
console.log('\nTstStrs:\n', JSON5Stringify(tstStrs), '\n\n');
for (let tstStrName in tstStrs) {
    let tstStr = tstStrs[tstStrName];
    for (let fncname in fncs) {
        let fnc = fncs[fncname];
        let res = fnc(tstStr);
        //let resStr = JSON.stringify(res, null, 2);
        let resStr = JSON5Stringify(res);
        //console.log(`\n\n${fncname}-${tstStrName}\n`, resStr, '\n\n');
        stdOut(`\n\n${fncname}-${tstStrName}\n`, resStr, '\n\n');
        // (${tstStrs[tstStr]}):\n`, res);
    }
}
/*
let claudeRes = extractCodeClaude(testString);
let oaiRes = extractCodeOAI(testString);

//console.log(JSON.stringify(extractCodeClaude(testString), null, 2));
console.log(`\n\ntestString:\n`, testString);
console.log(`\n\nclaudeRes:\n`, claudeRes);
console.log(`\n\noaiRes:\n`, oaiRes);
*/
//# sourceMappingURL=tstcb.js.map