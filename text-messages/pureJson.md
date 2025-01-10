
Your response should be pure `JSON`, without any markdown tags or additional text or comments. It will be automatically inserted into a database, therefore it is essential it is pure, unadorned `JSON`.

Your `JSON` response must comply with the `JSON Schema` provided, or a `JSON` array of objects, each complying with the schema. Note that the `JavaScript` value `undefined` is NOT valid `JSON`. Wherever you use `undefined` as a `JSON` value, use `null` instead. If the `schema` specifies/requires a `type` - like `string` - and you don't have relevant data/value, please try to generate the appropriate value. If you can't generate an appropriate value, use an empty value of the appropriate type rather than null - for example, for a `string` type, use the empty string `""`, for an object type, use `{}`, rather than null. **ENSURE** when the schema requires one of a set of `enum` values, you supply a valid `enum` value.

