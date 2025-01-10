[[webapp]] I have built multiple web applications with a React frontend and a Node.js/express backend API. I am very experienced with this. However, I would like to explore building web applications using a single codebase/repository for the frontend and the backend. I am looking at SSR with NextJS. I want to understand the possibilities and limitations of this approach, and have several questions:

- Simplicity - I don't mind how much effort it takes to initially set up the SSR, but I want to understand what if any added/ongoing development/maintenance complexities are introduced by implementing SSR.

- React Server Components - I have read about React Server Components, and I am interested in exploring this approach. As I understand with SSR, some of the React components can be pre-populated directly with data from the backend server without requiring API calls. More dynamic data resulting from user interactions would still require API calls. I am interested in understanding the possibilities and limitations of this approach.

- React Server Actions - If a react server component needs to reflect updated data from the backend server, can it just be reloaded rather than making API calls?

- NPM packages - Front and backend projects include many packages managed with NPM. I am interested in understanding how to manage dependencies between the frontend and backend projects. Is there a single package.json file and single `node_modules` directory for all packages in the entire project? How are conflicts between backend (node) and frontend (browser) packages handled?

- Is it possible to initialize a React Server Component with data directly from the backend server but update the data dynamically as the user interacts with the frontend?

- Can a component initially implemented as a React Server Component be converted to a React Client Component?

- Please provide examples of SSR with NextJS and React Server Components, along with a Node back backend that supports both SSR and API calls.


