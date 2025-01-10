# Notes\objInfo-generated-doc.md

| Function Name | Description | Parameters                          | Return Value               | Return Type                     | Return Description |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|-------------------------------|-------------------------------|-----------------------------------------------------------------------------------------------------------|
| `objInfo`      | Returns an object with information about the given argument, including type and properties.  | `arg: any`,<br>`opt: string = 'tpv'`,<br>`depth: number = 6` | `{type: string, instance?: {constructor: string, className: string?}, inheritance?: {[key: string]: {val: any, type: string, parsed: any}}, props?: {[key: string]: {val: any, type: string, parsed: any}}}` | Object                         | An object containing detailed information about the argument, including its type, instance details if applicable, inheritance information if available, and properties with their values, types, and parsed forms. |

Here is a breakdown of each part of the table:

### Function Name
`objInfo` - This is the name of the function.

### Description
Returns an object with information about the given argument, including type and properties.

### Parameters
- `arg: any`: The input argument whose information needs to be retrieved.
- `opt: string = 'tpv'` (Optional): A string that defines what details should be included in the returned information. It can include characters:
  - `t` for type,
  - `p` for parsed value,
  - `v` for raw value,
  - `f` for full property details.
- `depth: number = 6` (Optional): The depth to which the function should recurse to gather information about nested objects and properties.

### Return Value
An object containing detailed information about the argument.

### Return Type
Object: The return value is an object with various key-value pairs.

### Return Description
An object containing detailed information about the argument, including its type, instance details if applicable, inheritance information if available, and properties with their values, types, and parsed forms. Specifically:
- `type`: A string indicating the type of the input argument.
- `instance` (optional): An object containing the constructor name and possibly a className, only if the argument is an instance of a class.
- `inheritance` (optional): An array where each element represents a level in the inheritance chain. Each element itself is an object with:
  - `val`: The value at that level of the hierarchy.
  - `type`: The type of that value.
  - `parsed`: The parsed form of that value if applicable.
- `props` (optional): An object where each key represents a property name of the input argument, and its corresponding value is an object with:
  - `val`: The raw value of the property.
  - `type`: The type of the property.
  - `parsed`: The parsed form of the property if applicable.

