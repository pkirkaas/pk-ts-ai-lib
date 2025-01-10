[[node]] I have developed a reusable library of nodejs modules that I use in multiple projects. The modules are used in my projects as ESM modules. This all works, I need no help to set it up.

However, I have a special use case for a new module `auth` I am developing in my library. The library module `auth` should import a `User` class which should be defined in and imported from the project where the library is used.

How can I implement a library module that depends on a class defined in the project where the library is used?



