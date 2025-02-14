"use strict";
exports.__esModule = true;
exports.tstZodSchemas = exports.tstZods = exports.FunctionNamesSchema = void 0;
/**
 * Test various Zod schemas
 */
// NPM Imports
var zod_1 = require("zod");
var zod_to_json_schema_1 = require("zod-to-json-schema");
// Pk Lib Imports
var pk_ts_node_lib_1 = require("pk-ts-node-lib");
var FunctionNameSchema = zod_1.z.string()
    .min(1)
    .describe('A valid TypeScript function name that was exported from the source file')
    .refine(function (name) { return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name); }, {
    message: 'Must be a valid TypeScript identifier'
});
exports.FunctionNamesSchema = zod_1.z.object({
    functionNames: zod_1.z.array(FunctionNameSchema).describe('An array of exported function names')
});
exports.tstZods = {
    /*
    str: z.string(),
    strArr: z.array(z.string()),
    funcs: z.object({
      name: z.string().describe('The name of the function'),
      age: z.number().describe('The age of the function'),
    }),
    */
    //fncNames: z.object({ functionNames: z.array(FunctionNameSchema).describe('An array of exported function names'), }),
    fncNames: exports.FunctionNamesSchema
};
function tstZodSchemas(keyx) {
    if (pk_ts_node_lib_1.isEmpty(keyx)) {
        keyx = Object.keys(exports.tstZods);
    }
    var keys = pk_ts_node_lib_1.mkArray(keyx);
    var schemas = {};
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!exports.tstZods[key]) {
            throw new pk_ts_node_lib_1.PkError("Invalid key:", { key: key });
        }
        var zod = exports.tstZods[key];
        var schema = zod_to_json_schema_1.zodToJsonSchema(zod);
        schemas[key] = schema;
    }
    //  let zods = keys.map(k => tstZods[k]);
    //  let schemas = zods.map(zod => zodToJsonSchema(zod));
    return schemas;
}
exports.tstZodSchemas = tstZodSchemas;
//# sourceMappingURL=zod-schemas.js.map