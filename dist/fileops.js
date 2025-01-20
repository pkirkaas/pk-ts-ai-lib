/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
// NPM Imports
import fs from "fs-extra";
import path from "path";
// PkLib Imports
import { slashPath, isFile, PkError, isDirectory, isSimpleObject, JSON5Stringify, mkArray, getFiles, } from 'pk-ts-node-lib';
// Local Imports
import { 
//Strings, 
//mkArray,
matchPattern, } from './init.js';
/*
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

*/
/**
 * Build a message object from MD files in 'rootdirx'
 * Recursively build a message object from MD files in 'rootdirx', keyed by file name
 *
 * @param rootdirx?:Strings - root directory(ies) to find
 * Error if duplicate file names
 * return obj of {key: msg}
 */
export function getFileMsgObj(rootdirx) {
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
        let codeObj = isWrapCodeObj(arg) ? arg : { fpaths: arg };
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
export function wrapCodeFiles(fpathx, { root = '', desc = '' }) {
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
/*

//* @deprecated Takes a string response from a chatbot and extracts the code blocks
//* returns as an object keyed by lang tag to array of code blocks
export function extractCode1(resStr: string): GenObj {
 let ret: GenObj = {};
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

//  @deprecated Takes a string response from a chatbot and extracts the code blocks
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

/// Claude


//  * @deprecated Takes a string response from a chatbot and extracts the code blocks
export function extractCodeClaude(resStr: string,): CodeBlocks {
 const ret: CodeBlocks = {};
 let languages = Object.values(exts);

 // Create a regex pattern from the language array
 const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');

 // Improved regex to handle edge cases and use the dynamic language pattern
 const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\`\\s*$`, 'gim');

 let match: RegExpExecArray | null;
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

// * @deprecated
function sanitizeCodeBlock(code: string): string {
 // Replace triple backticks with single backticks to preserve code structure
 return code.replace(/```/g, '`');
}

// function escapeRegExp(string: string): string {
//   return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

// * @deprecated Takes a string response from a chatbot and extracts the code blocks
export function extractCodeClaude2(resStr: string,): CodeBlocks {
 const ret: CodeBlocks = {};

 // Create a regex pattern from the language array
 const langPattern = languages.map(lang => escapeRegExp(lang)).join('|');

 // Improved regex to handle edge cases and use the dynamic language pattern
 const codeBlockRegex = new RegExp(`^\\s*\`\`\`\\s*(${langPattern})\\s*\\n([\\s\\S]*?)\\n\\s*\`\`\`\\s*$`, 'gim');

 let match: RegExpExecArray | null;
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
*/
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
/*
export function wrapCode(srcArg: Strings | GenObj | GenObj[], opts: any = {}): string {
  let codeObjArr: GenObj[] = [];
  let srcArr: any[] = mkArray(srcArg);
  let codeStr = '\n';

  for (let src of srcArr) { // src either a string of a file path, or an object with properties fpaths, desc, root
    //let fpaths:Strings, desc:string, root:string;
    let fpaths: Strings;
    let desc: string;
    let root: string;
    let excPatterns: string[];
    let dirExc: string[];
    if (isSimpleObject(src)) {
      ({ fpaths, desc, root, dirExc, excPatterns } = (src as GenObj));
    } else {
      fpaths = (src as Strings);
    }

    fpaths = mkArray(fpaths);
    //if (typeof opts === 'string') {
   //   opts = { root: opts };
   // }
   // opts.root = opts.root || root;
    opts.desc = opts.desc || desc;
    //console.log(`wrapCode pre-res, fpaths: ${JSON5Stringify(fpaths)}, root:[${root}], opts: ${JSON5Stringify(opts)}`);
    //if (opts.root) {
     // opts.root = slashPath(path.resolve(opts.root));
   // }
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
      } else if (!isFile(fpath)) {
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
*/
//*   @param opts.desc:string? - description of code block
/**
 * Takes a directory & recurses, wrapping each file in a code block
 * @param dir - directory to recurse
 * @param opts?:string|GenObj - optional object with optional properties:
 *   @param opts.root:string? - root directory for project
 *   @param opts.excPatterns:string[]? - Patterns of filenames to exclude from file list
 *   @param opts.dirExc:string[]? - Patterns of directory names to exclude from file list
 */
/*
export function wrapCodeDir(dir: string, opts: any = {}) {
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
  */ 
//# sourceMappingURL=fileops.js.map