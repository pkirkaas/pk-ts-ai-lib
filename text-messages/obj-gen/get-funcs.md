[[ts]]

Your task is to parse the `TypeScript` source code included below, and return a `JSON` object for all the exported TypeScript functions as per the schema definition included.

The returned `JSON` object should have a key called `functionNames`. The value of the key should be an array of the names of all the functions exported from the source code.

{|
 keyed by the name of each exported TypeScript function; the value for each function name key should be an array of strings of all the specified TypeScript signatures for each function name. If you can't determine a signature for any function, return an array consisting of an empty string `['']` as the signature array of that function.
 |}

The TypeScript source file:

{{C:/www/TypeScriptLibs/Pk-Ts-Common/src/common-operations.ts}}