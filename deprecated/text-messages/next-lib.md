[[nextssr]]

We have many Web Application projects build on the latest NextJS, using React >= v 19 with SSR and `React Server Components`, and the NextJS `App Router`. These projects share many similar functionalities.

The goal is to refactor these common NextJS/React functionalities into a shared (internal) NPM library to import into the separate web applications.

We have created a new, empty NextJS project called `Pk-Next-Lib` with `npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" next-lib`

It works, and the default `npm run dev` starts the demo page and we can develop and test the common library components there.

However, the question is how to export those components for use in our web applications. The default `tsconfig.json` sets `"no-emit":true,`, so there are no compiled `js` files in `dist`.

The default `tsconfig.json` file is:
{{C:/www/TypeScriptLibs/Pk-Next/tsconfig.json}}

The `package.json` file is:
{{C:/www/TypeScriptLibs/Pk-Next/package.json}}

We want to enable the library `Pk-Next-Lib` both to run as a regular NextJS web app for testing, as well as to be built as a library with exports that can be included in other projects.

Please consider and suggest alternatives/possibilities, and ask for any additional information you require for your best response.