[[vscode]]

You are an expert in Git version management, configuration, and commands.

You are also an expert in various GIT GUI tools - particulary with `Sourcetree`, and VSCode using the native VSCode git support, as well as the VSCode extension 'GitLens' 

I have used GIT for many years, but only enough to do what I have to do.

Currently, I have a three way merge conflict with my repository I would like to resolve into a single branch.

The conflicting branches are `local/working`, `local/aider-test`, and the remote working branch `origin/working`

I would like to use a GUI tool to help me resolve these merge conflicts. I have the latest VSCode with its native git/version management support, as well as the GitLens VSCode extension/plugin.

I also have Atlassian 'SourceTree' as an external GIT Gui.

These are all installed and configured correctly - I can do the basics with them - but I find the GUIs unclear and non-intuitive and very busy and confusing.

Please provide several suggestions how to resolve the merge conflicts using GUI tools, with particular detail on what buttons / menu items to click where, and go through slowly and step by step.

Also, recommend which tools are better for which purpose, and which is best overall.

On a related git merge topic - this is a general merge questoin for future reference.

Suppose my project has two branches, `main` and `test`, with different commited changes on each.

After I am satisfied with the code on `test`, I want to merge it into the main branch:

```sh
git checkout main
git merge test
```

And usually git manages the merge as it should.

However, particularly with binary files, it often happens that most of the merges work fine, but there are a couple of conflicts in the binary files.

In that case, I don't want to manually resolve the merge conflicts - I just want to take the binary versions from branch `test` without examining them.

What is a good, simple way to do this from the command line, while still merging the files that can be merged automatically?


