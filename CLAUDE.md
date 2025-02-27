# AI-TS-Lib Repository Guidelines

## Build & Test Commands
- Build: `npm run build` (runs TypeScript compiler)
- Clean & Rebuild: `npm run clean` (removes dist, node_modules, reinstalls deps, runs tsc)
- Run test files: `node --loader ts-node/esm src/test.ts`
- Run single test: `node --loader ts-node/esm src/cli.ts fncs testName`
- Run CLI: `node --loader ts-node/esm src/cli.ts fncs`

## Code Style Guidelines
- **Module format**: Use ESM import/export syntax (not CommonJS require)
- **File structure**: Keep related functionality in same file/module
- **Imports**: Group imports by npm libraries, pk-lib imports, local imports
- **Types**: Prefer TypeScript interfaces and type aliases over any
- **Error handling**: Use PkError for custom errors, with detailed context objects
- **Naming**: camelCase for variables/functions, PascalCase for classes/interfaces
- **Comments**: Use JSDoc-style comments for functions
- **Debug logging**: Use dbgWrt for debug outputs to files in tmp/ directory
- **Optional parameters**: Mark clearly with ? or default values
- **Async/Promises**: Handle properly with try/catch, avoid callback nesting

This file is for agentic coding assistants working in the repository.