[[nextssr]] I am developing a web application project that uses NextJS, React, TypeScript, and Node.js. I have created the project and added some custom code with some success. 

I want to use command line scripts to test various backend library functions, which I also import into the application components.

Therefore, I have two `tsconfig` files: For the web application, I use `tsconfig.json`. For the CLI scripts, I use `tsconfig.cli.json`

My configuration files are:

[[nextconfs]]

`npm run dev` successfully launches the web application in development mode.

However, `npm run build` fails with the following uninformative error:

```
> next build -d

   ▲ Next.js 15.0.3
   - Environments: .env

   Creating an optimized production build ...
Failed to compile.

./src/app/page.tsx + 179 modules
Unexpected end of JSON input

> Build failed because of webpack errors

```

How can I get more details about the error and how to fix it? How can I debug the build process?


{|
[[nextguits]]
[[nextclits]]
[[nextconf]]
[[nextpackage]]
It builds successfully, but I am having trouble with the NextJS & TypeScript & WebPack configuration. 

I use `esm` module system to import. 

Issue 1: I want to use command line scripts to test various backend library functions, which I also import into the application components.

The first problem I have is the import syntax for my local code libraries. If I build using the webapp `tsconfig.json` file, I have to import without the file extension, like this:

`import {MsgBuilder, getMsgsDS, getMsgs,} from './lib/index';`

However, if I build using the CLI `tsconfig.cli.json` file, I have to import with the file extension, like this:

`import {MsgBuilder, getMsgsDS, getMsgs,} from './lib/index.js';`

I don't care which way I have to import, but I want to use the same import syntax for both the webapp and the CLI scripts. My TypeScript config files are below. 


Please advise how to resolve this. Let me know if you need more information.
|}





