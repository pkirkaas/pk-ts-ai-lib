"use strict";
/**
 * Test read/write of typescript files from ./tmp/commonts for testing AI Agents
 * Assumes `.` is run from the project root
 */
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.extractCode = exports.getAllFiles = exports.languages = exports.wrapCodeFiles = exports.wrapCodeNew = exports.isWrapCodeObj = exports.filterExcludes = exports.exts = exports.encodeFile = exports.getFileMsgObj = void 0;
// NPM Imports
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
// PkLib Imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
// Local Imports
var init_js_1 = require("./init.js");
/**
 * Build a message object from MD files in 'rootdirx'
 * Recursively build a message object from MD files in 'rootdirx', keyed by file name
 *
 * @param rootdirx?:Strings - root directory(ies) to find
 * Error if duplicate file names
 * return obj of {key: msg}
 */
function getFileMsgObj(rootdirx) {
    rootdirx = rootdirx || './text-messages';
    var rootdirs = pk_ts_node_lib_1.mkArray(rootdirx);
    var ret = {};
    for (var _i = 0, rootdirs_1 = rootdirs; _i < rootdirs_1.length; _i++) {
        var rootdir = rootdirs_1[_i];
        if (!pk_ts_node_lib_1.isDirectory(rootdir)) {
            throw new pk_ts_node_lib_1.PkError("Not a directory [" + rootdir + "]");
        }
        var files = fs_extra_1["default"].readdirSync(rootdir, { recursive: true });
        for (var _a = 0, files_1 = files; _a < files_1.length; _a++) {
            var f = files_1[_a];
            if (f.endsWith(".md")) {
                var bname = path_1["default"].basename(f, ".md");
                //Seems to correctly escape single quotes?
                if (bname in ret) {
                    throw new pk_ts_node_lib_1.PkError("Duplicate file name key [" + bname + "] in [" + f + "]");
                }
                var contents = fs_extra_1["default"].readFileSync(pk_ts_node_lib_1.slashPath(rootdir, f), 'utf8');
                if (!contents || !pk_ts_node_lib_1.isString(contents) || pk_ts_node_lib_1.isEmpty(contents.trim())) {
                    throw new pk_ts_node_lib_1.PkError("No contents for bname: [" + bname + "]");
                }
                ret[bname] = fs_extra_1["default"].readFileSync(pk_ts_node_lib_1.slashPath(rootdir, f), 'utf8');
            }
        }
    }
    return ret;
}
exports.getFileMsgObj = getFileMsgObj;
/**
 * Encodes local file w. base64, returns data & mime type
 */
function encodeFile(fpath) {
    if (!pk_ts_node_lib_1.isFile(fpath)) {
        throw new pk_ts_node_lib_1.PkError("File [" + fpath + "] not found");
    }
}
exports.encodeFile = encodeFile;
exports.exts = {
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
    '.csv': 'csv'
};
/**
 * Filter out files that match exclude patterns
 * TODO: Improve this to handle more complex patterns
 * @param fpathx - Array of file paths
 * @param excpatx - Array of exclude patterns - currently matches any occurrence of the literal pattern substring
 * To exclude a directory, use a trailing slash
 * @returns Array of file paths that do not match exclude patterns
 */
function filterExcludes(fpathx, excpatx) {
    var fpaths = pk_ts_node_lib_1.mkArray(fpathx);
    var excpats = pk_ts_node_lib_1.mkArray(excpatx);
    var nexcpats = excpats.map(function (excpat) { return excpat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
    var joined = excpats.join("|");
    var njoined = nexcpats.join("|");
    //console.log({ excpats, joined, njoined});
    var pattern = new RegExp(nexcpats.join("|"), 'i'); // Combine patterns with OR operator and make case-insensitive
    return fpaths.filter(function (path) { return !path.match(pattern); });
}
exports.filterExcludes = filterExcludes;
function isWrapCodeObj(src) {
    return pk_ts_node_lib_1.isSimpleObject(src) && 'fpaths' in src;
}
exports.isWrapCodeObj = isWrapCodeObj;
/**
 * Wraps code in markdown code blocks
 * @param argx:WrapCodeParams - string or object w. fpaths, or array of such
 * @param dbg - debug - just list the file paths
 */
function wrapCodeNew(argx, dbg) {
    var codeStr = '\n';
    var defaultDirExc = ['node_modules', 'dist', 'build', 'out', 'target', '.git', 'log', 'logs', 'tmp',];
    var defaultExcPatterns = ['.tmp', '.swp', '.bak', '.orig', '.old', '.orig', '.log', '/tmp/',
        '.log', '/node_modules/', '/dist/', '.git', '/deprecated/', '/scripts/', '/out/', '/git-hooks/', 'package-lock.json',
    ];
    var args = pk_ts_node_lib_1.mkArray(argx);
    var aCnt = 0;
    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
        var arg = args_1[_i];
        aCnt++;
        var codeObj = isWrapCodeObj(arg) ? arg : { fpaths: arg };
        var fpaths = codeObj.fpaths, debug = codeObj.debug, root = codeObj.root, desc = codeObj.desc, excPatterns = codeObj.excPatterns, types = codeObj.types, dirExc = codeObj.dirExc;
        var fpathsArr = pk_ts_node_lib_1.mkArray(fpaths);
        var excPatternsArr = defaultExcPatterns.concat(pk_ts_node_lib_1.mkArray(excPatterns));
        var filePaths = [];
        var dirExcArr = defaultDirExc.concat(pk_ts_node_lib_1.mkArray(dirExc));
        for (var _a = 0, fpathsArr_1 = fpathsArr; _a < fpathsArr_1.length; _a++) {
            var fpath = fpathsArr_1[_a];
            fpath = pk_ts_node_lib_1.slashPath(fpath);
            if (!fs_extra_1["default"].existsSync(fpath)) {
                throw new pk_ts_node_lib_1.PkError("In wrapCodeNew-File [" + fpath + "] not found", { argx: argx });
            }
            if (pk_ts_node_lib_1.isDirectory(fpath)) {
                var files = pk_ts_node_lib_1.getFiles(fpath, types);
                filePaths = filePaths.concat(files);
            }
            else {
                filePaths.push(fpath);
            }
        }
        // filePaths should be an array of file paths
        var fPathsExc = filterExcludes(filePaths, excPatternsArr);
        if (debug || dbg) {
            codeStr += "\nDebugging wrapCodeNew: " + aCnt + "\nArg:\n" + pk_ts_node_lib_1.JSON5Stringify(arg) + "\nFile Paths:\n" + fPathsExc.join('\n') + "\n";
        }
        else {
            codeStr += wrapCodeFiles(fPathsExc, { root: root, desc: desc });
        }
    }
    return codeStr;
}
exports.wrapCodeNew = wrapCodeNew;
/**
 * Wraps code in markdown code blocks
 * The paths are already filtered to exclude directories and files matching exclude patterns
 * The result has a common description section if any, and common root directory, if any
 * @param fpathx:Strings - File Path or array
 * @param {root?:string, desc?:string} - root: Root directory, desc: Description
 * @returns {string} - Markdown code blocks
 *
 */
function wrapCodeFiles(fpathx, _a) {
    var _b = _a.root, root = _b === void 0 ? '' : _b, _c = _a.desc, desc = _c === void 0 ? '' : _c;
    var fpaths = pk_ts_node_lib_1.mkArray(fpathx);
    //console.log('Enter wrapCodeFiles - ',{  root, desc, fpaths });
    var rootDir = root ? pk_ts_node_lib_1.slashPath(path_1["default"].resolve(root)) : '';
    var outStr = "\n\n" + desc + "\n";
    for (var _i = 0, fpaths_1 = fpaths; _i < fpaths_1.length; _i++) {
        var fpath = fpaths_1[_i];
        fpath = pk_ts_node_lib_1.slashPath(fpath);
        if (!fs_extra_1["default"].existsSync(fpath)) {
            throw new pk_ts_node_lib_1.PkError("In wrapCodeFiles-File [" + fpath + "] not found", { fpathx: fpathx });
        }
        var fname = rootDir ? path_1["default"].relative(rootDir, fpath) : fpath;
        var ext = path_1["default"].extname(fpath);
        var lang = exports.exts[ext] || '';
        var code = fs_extra_1["default"].readFileSync(fpath, 'utf8');
        if (ext) {
            ext = ext.toLowerCase();
        }
        var basename = path_1["default"].basename(fpath);
        if (ext && !(ext in exports.exts)) {
            console.error("wrapCodeFiles, File [" + fpath + "] has unknown extension [" + ext + "]");
            //      continue;
            //throw new PkError(`File [${fpath}] has unknown extension [${ext}]`);
        }
        outStr += "\nThe code in file: `" + fname + "`\n```" + lang + "\n" + code + "\n```\n";
    }
    return outStr;
}
exports.wrapCodeFiles = wrapCodeFiles;
exports.languages = Object.values(exports.exts);
/**
 * Returns an array of all files in a directory, recursively
 * With default exclude dirnames & glob patterns
 */
function getAllFiles(dir, opts) {
    if (opts === void 0) { opts = {}; }
    if (!pk_ts_node_lib_1.isDirectory(dir)) {
        throw new pk_ts_node_lib_1.PkError("Directory [" + dir + "] not found");
    }
    //console.log(`getAllFiles, dir: ${dir}`);
    var _a = opts.excPatterns, excPatterns = _a === void 0 ? [] : _a, _b = opts.dirExc, dirExc = _b === void 0 ? [] : _b, stats = opts.stats;
    var fileList = [];
    var defaultDirExcludes = ['node_modules', '.', '..', '.git', 'dist', '.eslintrc.js', 'Old',
        'log', 'logs', 'tmp', 'out', 'build', 'dbs', 'package-lock.json', '.env', '.gitignore',
        'chats', 'Notes', 'git-hooks', '__pycache__', '.vscode', '.venv', '.pdm-build',
    ];
    //let defaultExtExcludes = ['.log', 'package-lock.json', '.env', '.gitignore', '.pdm-python', 'pdm.lock', ];
    var defaultExcludePatterns = ['*.log', '*.tmp', 'git', '*.svg', 'package-lock.json', '.env', '.gitignore', '.pdm-python', 'pdm.lock',];
    excPatterns = __spreadArrays(excPatterns, defaultExcludePatterns);
    dirExc = __spreadArrays(dirExc, defaultDirExcludes);
    var listing = fs_extra_1["default"].readdirSync(dir);
    for (var _i = 0, listing_1 = listing; _i < listing_1.length; _i++) {
        var item = listing_1[_i];
        if (dirExc.includes(item) || init_js_1.matchPattern(item, excPatterns)) {
            continue;
        }
        var itemPath = path_1["default"].join(dir, item);
        if (pk_ts_node_lib_1.isDirectory(itemPath)) {
            //console.log(`getAllFiles, dir: ${dir}, item: ${item}, itemPath: ${itemPath}, dirExc:`, {dirExc});
            fileList = __spreadArrays(fileList, getAllFiles(itemPath, opts));
        }
        else {
            if (dirExc.includes(item) || init_js_1.matchPattern(item, excPatterns)) {
                //if (extExc.includes(path.extname(item))) {
                continue;
            }
            if (stats) {
                var status_1 = fs_extra_1["default"].statSync(itemPath);
                var size = status_1.size;
                fileList.push({ itemPath: itemPath, size: size });
            }
            else {
                fileList.push(itemPath);
            }
        }
    }
    if (stats) {
        fileList.sort(function (a, b) {
            return b.size - a.size;
        });
    }
    return fileList;
}
exports.getAllFiles = getAllFiles;
/**
 * Use the latest implementation
 * Take a string response from a chatbot and extracts the code blocks
 * returns as an object keyed by lang tag to array of code blocks
 * @param resStr - string response from a chatbot
 * @returns an object keyed by lang tag to array of code blocks

 * Best so far, but doesn't handle empty code blocks
 * takes a string response from a chatbot and extracts the code blocks
 */
function extractCode(resStr) {
    resStr = "\n" + resStr + "\n";
    var ret = {};
    // Create a regex pattern from the language array
    var langPattern = exports.languages.map(function (lang) { return escapeRegExp(lang); }).join('|');
    // Improved regex to handle edge cases, including empty code blocks
    var codeBlockRegex = new RegExp("^\\s*```\\s*(" + langPattern + ")\\s*\\n([\\s\\S]*?)\\n\\s*```", 'gim');
    var match;
    var lastIndex = 0;
    while ((match = codeBlockRegex.exec(resStr)) !== null) {
        var fullMatch = match[0], lang = match[1], code = match[2];
        var normalizedLang = lang.toLowerCase().trim();
        var trimmedCode = code.trim();
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
exports.extractCode = extractCode;
/**
 * Escape regex special characters in string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=fileops.js.map