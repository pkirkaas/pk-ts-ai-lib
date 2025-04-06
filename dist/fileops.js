/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
// NPM Imports
import fs from "fs-extra";
import path from "path";
// PkLib Imports
import { slashPath, isFile, PkError, isDirectory, isSimpleObject, getDirname, getFilename, JSON5Stringify, mkArray, getFiles, isEmpty, isString, } from 'pk-ts-node-lib';
// Local Imports
import { matchPattern, codeFiles, } from './init.js';
const __dirname = getDirname(import.meta.url);
const __filename = getFilename(import.meta.url);
/**
 * Build a message object from MD files in 'rootdirx'
 * Recursively build a message object from MD files in 'rootdirx', keyed by file name
 *
 * @param rootdirx?:Strings - root directory(ies) to find
 * Error if duplicate file names
 * return obj of {key: msg}
 */
export function getFileMsgObj(rootdirx) {
    console.log(`ThisDir: ${__dirname}`);
    rootdirx = rootdirx || './text-messages';
    let rootdirs = mkArray(rootdirx);
    let ret = {};
    for (let rootdir of rootdirs) {
        if (!isDirectory(rootdir)) {
            throw new PkError(`Not a directory [${rootdir}]`);
        }
        let files = fs.readdirSync(rootdir, { recursive: true });
        for (let f of files) {
            if (f.endsWith(".md")) {
                let bname = path.basename(f, ".md");
                //Seems to correctly escape single quotes?
                if (bname in ret) {
                    throw new PkError(`Duplicate file name key [${bname}] in [${f}]`);
                }
                let contents = fs.readFileSync(slashPath(rootdir, f), 'utf8');
                if (!contents || !isString(contents) || isEmpty(contents.trim())) {
                    throw new PkError(`No contents for bname: [${bname}]`);
                }
                ret[bname] = fs.readFileSync(slashPath(rootdir, f), 'utf8');
            }
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
/**
 * Filter out files that match exclude patterns
 * TODO: Improve this to handle more complex patterns
 * @param fpathx - Array of file paths
 * @param excpatx - Array of exclude patterns - currently matches any occurrence of the literal pattern substring
 * To exclude a directory, use a trailing slash
 * @returns Array of file paths that do not match exclude patterns
 */
export function filterExcludes(fpathx, excpatx) {
    let fpaths = mkArray(fpathx);
    let excpats = mkArray(excpatx);
    let nexcpats = excpats.map(excpat => excpat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    let joined = excpats.join("|");
    let njoined = nexcpats.join("|");
    //console.log({ excpats, joined, njoined});
    const pattern = new RegExp(nexcpats.join("|"), 'i'); // Combine patterns with OR operator and make case-insensitive
    return fpaths.filter(path => !path.match(pattern));
}
export function isWrapCodeObj(src) {
    return isSimpleObject(src) && 'fpaths' in src;
}
/**
 * Allow string arg to 'wrapCodeNew' to be either a file/dir path,
 * OR key to codeFiles object
 */
export function toWrapCodeObj(arg) {
    if (isWrapCodeObj(arg)) {
        return arg;
    }
    if (isString(arg)) {
        if (arg in codeFiles) {
            return codeFiles[arg];
        }
        if (fs.existsSync(arg)) {
            return { fpaths: arg };
        }
    }
    throw new PkError(`Invalid arg to toWrapCodeObj:`, { arg });
}
/**
 * Wraps code in markdown code blocks
 * @param argx:WrapCodeParams - string or object w. fpaths, or array of such
 * @param dbg - debug - just list the file paths
 */
export function wrapCodeNew(argx, dbg) {
    let codeStr = '\n';
    let defaultDirExc = ['node_modules', 'dist', 'build', 'out', 'target', '.git', 'log', 'logs', 'tmp',];
    let defaultExcPatterns = ['.tmp', '.swp', '.bak', '.orig', '.old', '.orig', '.log', '/tmp/',
        '.log', '/node_modules/', '/dist/', '.git', '/deprecated/', '/scripts/', '/out/', '/git-hooks/', 'package-lock.json',
    ];
    let args = mkArray(argx);
    let aCnt = 0;
    for (let arg of args) {
        aCnt++;
        //let codeObj: WrapCodeObj = isWrapCodeObj(arg) ? arg : { fpaths: arg };
        let codeObj = toWrapCodeObj(arg);
        let { fpaths, debug, root, desc, excPatterns, types, dirExc } = codeObj;
        let fpathsArr = mkArray(fpaths);
        let excPatternsArr = defaultExcPatterns.concat(mkArray(excPatterns));
        let filePaths = [];
        let dirExcArr = defaultDirExc.concat(mkArray(dirExc));
        for (let fpath of fpathsArr) {
            fpath = slashPath(fpath);
            if (!fs.existsSync(fpath)) {
                throw new PkError(`In wrapCodeNew-File [${fpath}] not found`, { argx });
            }
            if (isDirectory(fpath)) {
                let files = getFiles(fpath, types);
                filePaths = filePaths.concat(files);
            }
            else {
                filePaths.push(fpath);
            }
        }
        // filePaths should be an array of file paths
        let fPathsExc = filterExcludes(filePaths, excPatternsArr);
        if (debug || dbg) {
            codeStr += `\nDebugging wrapCodeNew: ${aCnt}\nArg:\n${JSON5Stringify(arg)}\nFile Paths:\n${fPathsExc.join('\n')}\n`;
        }
        else {
            codeStr += wrapCodeFiles(fPathsExc, { root, desc, });
        }
    }
    return codeStr;
}
/**
 * Wraps code in markdown code blocks
 * The paths are already filtered to exclude directories and files matching exclude patterns
 * The result has a common description section if any, and common root directory, if any
 * @param fpathx:Strings - File Path or array
 * @param {root?:string, desc?:string} - root: Root directory, desc: Description
 * @returns {string} - Markdown code blocks
 *
 */
export function wrapCodeFiles(fpathx, { root = '', desc = '' } = {}) {
    let fpaths = mkArray(fpathx);
    //console.log('Enter wrapCodeFiles - ',{  root, desc, fpaths });
    let rootDir = root ? slashPath(path.resolve(root)) : '';
    let outStr = `\n\n${desc}\n`;
    for (let fpath of fpaths) {
        fpath = slashPath(fpath);
        if (!fs.existsSync(fpath)) {
            throw new PkError(`In wrapCodeFiles-File [${fpath}] not found`, { fpathx });
        }
        let fname = rootDir ? path.relative(rootDir, fpath) : fpath;
        let ext = path.extname(fpath);
        let lang = exts[ext] || '';
        let code = fs.readFileSync(fpath, 'utf8');
        if (ext) {
            ext = ext.toLowerCase();
        }
        let basename = path.basename(fpath);
        if (ext && !(ext in exts)) {
            console.error(`wrapCodeFiles, File [${fpath}] has unknown extension [${ext}]`);
            //      continue;
            //throw new PkError(`File [${fpath}] has unknown extension [${ext}]`);
        }
        outStr += `\nThe code in file: \`${fname}\`\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }
    return outStr;
}
/**
 * wrap a preformatted string (JSON prettyprint, etc) in markdown
 * because really error prone to do it manually
 * @param prestr:string - preformatted string
 * @param lang:string default '' - TODO - check lang in md lang keys
 * @return string wrapped for markdown block
 */
export function wrapStr(prestr, lang = '') {
    return `\n\`\`\`${lang}\n${prestr}\n\`\`\`\n`;
}
export let languages = Object.values(exts);
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
 * Use the latest implementation
 * Take a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 * @param resStr - string response from a chatbot
 * @returns an object keyed by lang tag to array of code blocks

 * Best so far, but doesn't handle empty code blocks
 * takes a string response from a chatbot and extracts the code blocks
 */
export function extractCode(resStr) {
    resStr = `\n${resStr}\n`;
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
/**
 * Escape regex special characters in string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//Port to node lib if works
import util from 'util';
/**
 * Console.log replacement - excepts outputs string values directly, without
 */
export function formatValue(value, indentLevel = 0) {
    const indent = ' '.repeat(indentLevel * 2); // Indentation for nested structures
    if (typeof value === 'string') {
        return value.split('\n').map(line => indent + line).join('\n'); // Preserve multi-line strings
    }
    if (Array.isArray(value)) {
        return '[\n' + value.map(item => formatValue(item, indentLevel + 1)).join(',\n') + '\n' + indent + ']';
    }
    if (typeof value === 'object' && value !== null) {
        return '{\n' + Object.entries(value)
            .map(([k, v]) => `${indent}  ${k}: ${formatValue(v, indentLevel + 1)}`)
            .join(',\n') + '\n' + indent + '}';
    }
    return util.inspect(value, { depth: null, colors: true }); // Default console formatting for non-string types
}
export function logPretty(...args) {
    console.log('\n');
    for (let arg of args) {
        console.log(formatValue(arg)); // Start with zero indentation
    }
    console.log('\n');
}
//# sourceMappingURL=fileops.js.map