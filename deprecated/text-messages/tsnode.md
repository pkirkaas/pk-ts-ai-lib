[[node]]
I am developing node js (node version 23) applications using typescript. I have several typescript test scripts I call from the command line. I want any errors/exceptions to show the line number and file name from the typescript source code.

Assume running from the root of the project. The typescript source code is in the src directory, the compiled javascript is in the dist directory.

I used to use the ts-node module to run the typescript source code directly, but that is deprecated.

Currently the way I am running the typescript source code is:

`tsc && node dist/test.js`

Which works, but I have to run tsc before I run the test and the errors are shown for the compiled javascript.

I understand nodejs has support for typescript now. I would like to run node directly on the typescript source code, like `node src/test.ts`, or have some other way to have the errors show the line number and file name from the typescript source code.

Please give me detailed instructions on how to do this, with pros and cons of each method.

