[[webapp]] I have the source code for a modern React front end application, built with multiple `npm` packages, `typescript`, `*.tsx` components, and `sass` style components. The application works when using `react-scripts start` to start the development server.

However, I want to build and bundle the application into a static folder structure with `index.html`, and `css` and `js` files that can be served  with a simple Node.js server, using `express` and `express-static` to serve the static files.

`react-scripts` is not an option, because it outdated and not maintained.

I want a modern, well-documented, and well-tested solution to bundle the application into a static folder structure. Performance optimization is **NOT** REMOTELY important. The application is not intended to be used in a production environment, and is only intended for development and testing purposes. Simplicity and ease of use is the most important factor.

Please provide several detailed, well-documented, and well-tested solutions/alternatives to bundle the application into a static folder structure, with pros/cons/things to consider for each solution.

