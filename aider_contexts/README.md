# Aider Context Files

This directory contains context files that can be loaded into aider conversations to provide common instructions and guidelines.

## Usage

To use these context files with aider:

```bash
aider --add-context ts_development.md your_file.ts
```

Or within an aider session:

```
/add ts_development.md
```

## Available Context Files

- **ts_development.md**: Guidelines for TypeScript development
- **ai_sdk_usage.md**: Instructions for working with the Vercel AI SDK

## Creating New Context Files

When creating new context files:

1. Use clear section headers with markdown formatting
2. Include examples where helpful
3. Keep instructions concise and specific
4. Group related instructions together
