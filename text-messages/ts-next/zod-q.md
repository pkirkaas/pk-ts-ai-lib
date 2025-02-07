{| ZOD questions |}
[[zod]]

{|
I want to create a typescript function that expects a Zod Schema as its first parameter - like:

```ts
import {z} from 'zod';
export function jsonSchemaFromZod(schema:z.ZodSchema):string {
  // Return the json schema from the zod schema
};
```

I want the function to accept ANY valid Zod schema instance, but only zod schema instances. Is the above correct, or are there better ways?

Also, given a zod schema, I want to be able to check if it is an array, object, or primitive schema type. How do I do that?
|}


I am developing a node AI application that uses the OpenAI API for structured outputs.

The structured output api requires a JSON schema to define the structured output.

I want to use Zod to create JSON schemas for structured output. The openai documentation at `https://platform.openai.com/docs/guides/structured-outputs#supported-schemas` provides an example of a valid json schema:

```json
{
    "name": "ui",
    "description": "Dynamically generated UI",
    "strict": true,
    "schema": {
        "type": "object",
        "properties": {
            "type": {
                "type": "string",
                "description": "The type of the UI component",
                "enum": ["div", "button", "header", "section", "field", "form"]
            },
            "label": {
                "type": "string",
                "description": "The label of the UI component, used for buttons or form fields"
            },
            "children": {
                "type": "array",
                "description": "Nested UI components",
                "items": {
                    "$ref": "#"
                }
            },
            "attributes": {
                "type": "array",
                "description": "Arbitrary attributes for the UI component, suitable for any element",
                "items": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "description": "The name of the attribute, for example onClick or className"
                        },
                        "value": {
                            "type": "string",
                            "description": "The value of the attribute"
                        }
                    },
                    "additionalProperties": false,
                    "required": ["name", "value"]
                }
            }
        },
        "required": ["type", "label", "children", "attributes"],
        "additionalProperties": false
    }
}
```

How can I define good JSON schemas for OpenAI structured outputs using `zod`?

That is, how best to define a schema directly with Zod that can be converted to a valid JSON schema for OpenAI API structured output