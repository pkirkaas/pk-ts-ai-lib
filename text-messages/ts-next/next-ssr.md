[[default]] [[nextssr]] I have built multiple web applications with a React frontend and a Node.js/express backend API. I am very experienced with this. However, I would like to explore building web applications using a single codebase/repository for the frontend and the backend. I am looking at SSR with NextJS.

Requirements:

- Technologies - NextJS, React, Node.js/express, TypeORM, SQLite, TypeScript, SCSS
- ESM Modules - not CJS modules
- SSR with NextJS.
- Common codebase and repository for the frontend and the backend.
- Back end implemented with Node.js/express for routing, and TypeORM with SQLite for database access.
- Front end implemented with the latest React (19-beta), using React Server Components and React Server Actions.
- The RSC should be able to call backend functions directly, and update the data dynamically as the user interacts with the frontend.
- Performance optimization is NOT desired. Simplicity and ease of development are the highest priorities.
- Server Components should be able to call backend functions directly, and update the data dynamically as the user interacts with the frontend.
- The project will also have React Client Components. We will use the `use client` and `use server` directives to separate the server and client code.
- Because of these requirements, the implementation will be very dependent on the NextJS framework and bundler.

Build system requirements and structure:

- All TypeScript source code should be in the `src` directory.
- The `src` directory will have at least 3 subdirectories: `src/server`, `src/app`, and `src/shared`.
- The `src/server` directory will contain the backend code, including the Node.js/express server, TypeORM, SQLite, and TypeScript. 
- The TypeScript configuration will be different for the backend and the frontend. 
- The main `package.json` file will include npm scripts for building and running the backend server and frontend components.
- To support the React Server Components, we will use the NextJS App Router, not the Pages Router.
- Since we are using NextJS > v.15, and TypeScript, the next config file can be `next.config.ts`, with minimal configuration.

This project will be implemented in multiple steps. Here are your initial tasks - respond fully, completely and in detail. 


- Project creation - recommend the appropriate options & NextJS project creation template for the project, considering the project will include both a frontend and a backend.
- 
- NPM packages - Front and backend projects include many packages managed with NPM. I am interested in understanding how to manage dependencies between the frontend and backend projects. Is there a single package.json file and single `node_modules` directory for all packages in the entire project? How are conflicts between backend (node) and frontend (browser) packages handled?

- Propose a project structure that meets the requirements. All typescript files should be in a `src` directory - or two source directories - one for the frontend and one for the backend? Recommend.

- Configurations - next.config.ts, tsconfig.json, tsconfig.server.json, package.json, etc

- Example `src/app/users/page.tsx` file, which demonstrates updating data in the DB from a form submission, and how that will trigger a rerender of the component based on the updated information. Provide examples of how to trigger the rerender via `revalidatePath` and `revalidateTag`, or streaming updates with React `Suspense`, and other alternatives.


- Example `src/server/server.ts` file, which demonstrates how the server will serve the frontend.

Please provide examples of SSR with NextJS and React Server Components, along with a Node back backend that supports both SSR and API calls.
"Q:\Local\pxk\.vscodevimrc"
