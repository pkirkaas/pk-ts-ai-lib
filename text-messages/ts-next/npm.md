[[ts]]
I have a large typescript library which I use in several projects which has been developed over several years. It uses `npm` and `package.json` in install many, many dependencies, which themselves have their own dependencies.

When I run `npm install` in the root of the project, I get a lot of warnings about dependencies which are not needed. I have tried to reduce the number of dependencies by using `npm dedupe` and `npm prune`, but this does not seem to work.






{|
I have a large typescript library which I use in several projects. I haven't published it as an `npm` package, but I include it as a dependency in my projects through a github url. I also provide several exports from the package.json as sub packages. This works fine, but I am not sure I am doing the sub-package exports in the best way. Below is an example of my package.json.

Please review this, and provide any suggestions on how to improve this.

[[fepackage]]
|}