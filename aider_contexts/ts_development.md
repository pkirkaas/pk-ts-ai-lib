# TypeScript Development Context

## Common TypeScript Development Instructions

- Use TypeScript best practices
- Follow the existing code style and patterns
- Ensure proper type safety
- Add JSDoc comments for public APIs
- Write unit tests for new functionality

## Common TypeScript Imports

```typescript
// Common imports for this project
import { z } from 'zod';
import { GenObj, isObject, isSimpleObject, isEmpty } from 'pk-ts-node-lib';
```

## Zod Schema Development Guidelines

When creating Zod schemas:
1. Use descriptive `.describe()` annotations
2. Include examples when possible
3. Keep type definitions close to schemas
4. Use proper TypeScript inference with z.infer<>
5. Keep schemas modular and composable
