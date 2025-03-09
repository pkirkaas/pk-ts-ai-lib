# AI SDK Usage Context

## Vercel AI SDK Guidelines

When working with the Vercel AI SDK:

- Import necessary components: `import { generateObject } from 'ai/rsc'`
- Use proper Zod schemas for object generation
- Include examples with schemas to guide the AI model
- Keep descriptions concise and clear
- Use appropriate temperature settings (0.7-0.9 for creative tasks, 0.1-0.3 for structured data)

## Example Usage

```typescript
import { generateObject } from 'ai/rsc';
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  name: z.string().describe("User's full name"),
  age: z.number().describe("User's age in years"),
  interests: z.array(z.string()).describe("User's hobbies and interests")
});

// Example for the model
const userExample = {
  name: "Jane Smith",
  age: 28,
  interests: ["programming", "hiking", "photography"]
};

// Generate object
const user = await generateObject({
  model: "gpt-4-turbo",
  schema: userSchema,
  examples: [userExample],
  prompt: "Generate a profile for a software developer"
});
```

## Common Issues and Solutions

- If the model generates invalid objects, provide more specific examples
- For complex nested objects, break down schemas into smaller components
- Use appropriate temperature settings based on the task
