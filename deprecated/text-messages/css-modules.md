[[nextssr]] I am developing a web application project that uses NextJS, React, TypeScript, and Node.js. I have created the project - let's call it `pk-app` - and added some custom code with some success. 

I also have created a library of custom react components - call it `pk-ts-fe-lib` that I want to use in the web application. 

One of the components in the library is called `resizable`. It uses the css modules system and imports - which works fine when I am creating a test app in the library itself.

The problem is that when I try to use the `resizable` component in the web application, I get the following error: 


```
./node_modules/pk-ts-fe-lib/dist/esm/components/resizable-panels/resizable-components.js:20:1
Module not found: Can't resolve './resizable.module.css'
  18 | import { arrayJoin, } from 'pk-ts-common-lib';
  19 | // Local Packages
> 20 | import styles from "./resizable.module.css";
     | ^
  21 | //import styles from "@/components/resizable-panels/resizable.module.css";
  22 | import { addClassNames, replaceProps, } from '../../libs/reactUtils.js';
  23 | //export * from "react-resizable-panels";

https://nextjs.org/docs/messages/module-not-found

Import trace for requested module:
./node_modules/pk-ts-fe-lib/dist/esm/components/index.js
./node_modules/pk-ts-fe-lib/dist/esm/index.js
./src/app/page.tsx
```