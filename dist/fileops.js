/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
// NPM Imports
import fs from "fs-extra";
import path from "path";
// PkLib Imports
import { slashPath, isFile, PkError, isDirectory, isSimpleObject, JSON5Stringify, } from 'pk-ts-node-lib';
// Local Imports
import { mkArray, matchPattern, } from './init.js';
export function getCommonTs() {
    //let commonTs = fs.readFileSync('./tmp/commonts/common-operations.ts', 'utf8');
    let commonTs = fs.readFileSync("C:/www/TypeScriptLibs/Pk-Ts-Common/src/common-operations.ts", 'utf8');
    return '\n```typescript\n' + commonTs + '\n```\n';
}
export function initChatMd({ outpath, model, provider, stamp, }) {
}
export function getTxtMsg(fname) {
    let msg = fs.readFileSync(`./text-messages/${fname}.md`, 'utf8');
    return msg;
}
/**
 * Get all text messages in ./text-messages (recursively)
 * Error if duplicate file names
 * return obj of {key: msg}
 */
export function getTxtMsgs() {
    let files = fs.readdirSync(`./text-messages`, { recursive: true });
    //console.error(files);
    let ret = {};
    for (let f of files) {
        if (f.endsWith(".md")) {
            let bname = path.basename(f, ".md");
            //Seems to correctly escape single quotes?
            if (bname in ret) {
                throw new PkError(`Duplicate file name key [${bname}] in [${f}]`);
            }
            ret[bname] = fs.readFileSync(`./text-messages/${f}`, 'utf8');
        }
    }
    return ret;
}
/**
 * Encodes local file w. base64, returns data & mime type
 */
export function encodeFile(fpath) {
    if (!isFile(fpath)) {
        throw new PkError(`File [${fpath}] not found`);
    }
}
export const exts = {
    '.js': 'javascript',
    '.mjs': 'javascript',
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.ts': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rb': 'ruby',
    '.php': 'php',
    '.swift': 'swift',
    '.kt': 'kotlin',
    '.rs': 'rust',
    '.scala': 'scala',
    '.pl': 'perl',
    '.lua': 'lua',
    '.sh': 'shell',
    '.bat': 'batch',
    '.ps1': 'powershell',
    '.sql': 'sql',
    '.xml': 'xml',
    '.json': 'json',
    '.json5': 'json5',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.ini': 'ini',
    '.toml': 'toml',
    '.md': 'markdown',
    '.txt': 'text',
    '.log': 'log',
    '.csv': 'csv',
};
//export const exclude
/**
 * Wraps code in a file in a code block & returns it as a string wrapped in triple backticks
 * with appropriate language tag
 * @param src:Strings|GenObj - path or path array to files/directories, or object w. property fpath, base, desc
 * @param opts?:string|GenObj - optional object with properties:
 * @param opts.root:string? - root directory for project
 * @param opts.desc: string? - description of code block
 *
 */
// Refactor - ignore 'opts' arg, use 'src' arg to determine what to wrap
export function wrapCode(srcArg, opts = {}) {
    let codeObjArr = [];
    let srcArr = mkArray(srcArg);
    let codeStr = '\n';
    for (let src of srcArr) { // src either a string of a file path, or an object with properties fpaths, desc, root
        //let fpaths:Strings, desc:string, root:string;
        let fpaths;
        let desc;
        let root;
        let excPatterns;
        let dirExc;
        if (isSimpleObject(src)) {
            ({ fpaths, desc, root, dirExc, excPatterns } = src);
        }
        else {
            fpaths = src;
        }
        fpaths = mkArray(fpaths);
        /*
        if (typeof opts === 'string') {
          opts = { root: opts };
        }
        opts.root = opts.root || root;
        opts.desc = opts.desc || desc;
        //console.log(`wrapCode pre-res, fpaths: ${JSON5Stringify(fpaths)}, root:[${root}], opts: ${JSON5Stringify(opts)}`);
        if (opts.root) {
          opts.root = slashPath(path.resolve(opts.root));
        }
          */
        //console.log(`wrapCode post-res, fpaths: ${JSON5Stringify(fpaths)}, root:[${root}], opts: ${JSON5Stringify(opts)}`);
        //console.log(`wrapCode, fpaths: ${JSON5Stringify(fpaths)}, opts: ${JSON5Stringify(opts)}`);
        //let { root, desc = "", } = opts;
        //console.log(`wrapCode, fpaths: ${JSON5Stringify(fpaths)}, root:[${root}], opts: ${JSON5Stringify(opts)}`);
        for (let fpath of fpaths) {
            if (desc) {
                desc = `\n${desc}\n`;
            }
            fpath = slashPath(path.resolve(fpath));
            if (isDirectory(fpath)) {
                codeStr += `${desc}${wrapCodeDir(fpath, { root, dirExc, excPatterns })}\n\n`;
                continue;
            }
            else if (!isFile(fpath)) {
                throw new PkError(`File [${fpath}] not found`);
            }
            let ext = path.extname(fpath);
            if (ext) {
                ext = ext.toLowerCase();
            }
            let basename = path.basename(fpath);
            if (ext && !(ext in exts)) {
                console.error(`wrapCode, File [${fpath}] has unknown extension [${ext}]`);
                continue;
                //throw new PkError(`File [${fpath}] has unknown extension [${ext}]`);
            }
            if (root) { // change basename to be relative to root
                root = slashPath(path.resolve(opts.root));
                if (!root.endsWith('/')) {
                    root += '/';
                }
                if (!isDirectory(root)) {
                    throw new PkError(`Root [${root}] not found`);
                }
                if (!fpath.startsWith(root)) {
                    throw new PkError(`File [${fpath}] not in root [${root}]`);
                }
                basename = fpath.substring(root.length);
                console.log(`wrapCode, basename: ${basename}, root: ${root}, fpath: ${fpath}`);
                //console.log(`testing wrapCode, basename: ${basename}, root: ${root}, fpath: ${fpath}`);
            }
            let lang = exts[ext] || '';
            let code = fs.readFileSync(fpath, 'utf8');
            codeStr += `${desc || ''}\nThe code in file: \`${basename}\`\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
        }
    }
    return codeStr;
}
//*   @param opts.desc:string? - description of code block
/**
 * Takes a directory & recurses, wrapping each file in a code block
 * @param dir - directory to recurse
 * @param opts?:string|GenObj - optional object with optional properties:
 *   @param opts.root:string? - root directory for project
 *   @param opts.excPatterns:string[]? - Patterns of filenames to exclude from file list
 *   @param opts.dirExc:string[]? - Patterns of directory names to exclude from file list
 */
export function wrapCodeDir(dir, opts = {}) {
    if (!opts.root) {
        opts.root = slashPath(path.resolve(dir));
    }
    console.log(`wrapCodeDir, dir: ${dir}, opts: ${JSON5Stringify(opts)}`);
    let fileList = getAllFiles(dir, opts);
    let ret = '';
    for (let fpath of fileList) {
        ret += wrapCode(fpath, opts);
    }
    return ret;
}
/**
 * Returns an array of all files in a directory, recursively
 * With default exclude dirnames & glob patterns
 */
export function getAllFiles(dir, opts = {}) {
    if (!isDirectory(dir)) {
        throw new PkError(`Directory [${dir}] not found`);
    }
    //console.log(`getAllFiles, dir: ${dir}`);
    let { excPatterns = [], dirExc = [], stats, } = opts;
    let fileList = [];
    let defaultDirExcludes = ['node_modules', '.', '..', '.git', 'dist', '.eslintrc.js', 'Old',
        'log', 'logs', 'tmp', 'out', 'build', 'dbs', 'package-lock.json', '.env', '.gitignore',
        'chats', 'Notes', 'git-hooks', '__pycache__', '.vscode', '.venv', '.pdm-build',
    ];
    //let defaultExtExcludes = ['.log', 'package-lock.json', '.env', '.gitignore', '.pdm-python', 'pdm.lock', ];
    let defaultExcludePatterns = ['*.log', '*.tmp', 'git', '*.svg', 'package-lock.json', '.env', '.gitignore', '.pdm-python', 'pdm.lock',];
    excPatterns = [...excPatterns, ...defaultExcludePatterns,];
    dirExc = [...dirExc, ...defaultDirExcludes];
    let listing = fs.readdirSync(dir);
    for (let item of listing) {
        if (dirExc.includes(item) || matchPattern(item, excPatterns)) {
            continue;
        }
        let itemPath = path.join(dir, item);
        if (isDirectory(itemPath)) {
            //console.log(`getAllFiles, dir: ${dir}, item: ${item}, itemPath: ${itemPath}, dirExc:`, {dirExc});
            fileList = [...fileList, ...getAllFiles(itemPath, opts)];
        }
        else {
            if (dirExc.includes(item) || matchPattern(item, excPatterns)) {
                //if (extExc.includes(path.extname(item))) {
                continue;
            }
            if (stats) {
                let status = fs.statSync(itemPath);
                let size = status.size;
                fileList.push({ itemPath, size });
            }
            else {
                fileList.push(itemPath);
            }
        }
    }
    if (stats) {
        fileList.sort((a, b) => {
            return b.size - a.size;
        });
    }
    return fileList;
}
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 */
export function extractCode1(resStr) {
    let ret = {};
    let langs = Object.values(exts);
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
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export function extractCodeOAI(resStr) {
    const ret = {};
    let langs = Object.values(exts);
    for (const lang of langs) {
        // Regular expression to capture code blocks for a specific language
        const langRegex = new RegExp(`\n\\\`\\\`\\\`${lang}\\n([\\s\\S]*?)\\n\\\`\\\`\\\``, 'g');
        let match;
        while ((match = langRegex.exec(resStr)) !== null) {
            const code = match[1].trim();
            if (code) {
                if (!ret[lang]) {
                    ret[lang] = [];
                }
                ret[lang].push(code);
            }
        }
    }
    return ret;
}
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export function extractCodeClaude(resStr) {
    const ret = {};
    let languages = Object.values(exts);
    // Create a regex pattern from the language array
    const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');
    // Improved regex to handle edge cases and use the dynamic language pattern
    const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\`\\s*$`, 'gim');
    let match;
    while ((match = codeBlockRegex.exec(resStr)) !== null) {
        const [, lang, code] = match;
        const normalizedLang = lang.toLowerCase().trim();
        if (!ret[normalizedLang]) {
            ret[normalizedLang] = [];
        }
        const trimmedCode = code.trim();
        if (trimmedCode) {
            ret[normalizedLang].push(sanitizeCodeBlock(trimmedCode));
        }
    }
    return ret;
}
/**
 * @deprecated
 */
function sanitizeCodeBlock(code) {
    // Replace triple backticks with single backticks to preserve code structure
    return code.replace(/```/g, '`');
}
/*
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
  */
export let languages = Object.values(exts);
export let langs = Object.values(exts);
/**
 * @deprecated Takes a string response from a chatbot and extracts the code blocks
 */
export function extractCodeClaude2(resStr) {
    const ret = {};
    // Create a regex pattern from the language array
    const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');
    // Improved regex to handle edge cases and use the dynamic language pattern
    const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\`\\s*$`, 'gim');
    let match;
    while ((match = codeBlockRegex.exec(resStr)) !== null) {
        const [, lang, code] = match;
        const normalizedLang = lang.toLowerCase().trim();
        if (!ret[normalizedLang]) {
            ret[normalizedLang] = [];
        }
        const trimmedCode = code.trim();
        if (trimmedCode) {
            ret[normalizedLang].push(trimmedCode);
        }
    }
    return ret;
}
/**
 * Use the latest implementation
 * Take a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 * @param resStr - string response from a chatbot
 * @returns an object keyed by lang tag to array of code blocks
 */
export function extractCode(resStr) {
    resStr = `\n${resStr}\n`;
    return extractCodeC3(resStr);
}
/**
 * Best so far, but doesn't handle empty code blocks
 * takes a string response from a chatbot and extracts the code blocks
 */
export function extractCodeC3(resStr) {
    const ret = {};
    // Create a regex pattern from the language array
    const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');
    // Improved regex to handle edge cases, including empty code blocks
    const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\``, 'gim');
    let match;
    let lastIndex = 0;
    while ((match = codeBlockRegex.exec(resStr)) !== null) {
        const [fullMatch, lang, code] = match;
        const normalizedLang = lang.toLowerCase().trim();
        const trimmedCode = code.trim();
        if (trimmedCode) { // Only add non-empty code blocks
            if (!ret[normalizedLang]) {
                ret[normalizedLang] = [];
            }
            ret[normalizedLang].push(trimmedCode);
        }
        // Move the lastIndex to the end of this match to avoid overlapping matches
        lastIndex = match.index + fullMatch.length;
        codeBlockRegex.lastIndex = lastIndex;
    }
    return ret;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=fileops.js.map