# Contributing to vue-tree

Thank you for your interest in contributing to the vue-tree component. What follows is a set of guidelines for contributors who intend to make changes for incorporation into the [grapoza/vue-tree](https://github.com/grapoza/vue-tree) repository.

## Just need to report an issue?

If you notice a problem with vue-tree but don't have the means to submit a patch yourself, you can still contribute to the success of the project by [filing an issue](https://github.com/grapoza/vue-tree/issues). Be sure to include all of the requested information, and if possible provide a reproduction of the issue.

You can also submit an issue if you just have a question about the component. If you do this, please be sure to label your issue with **question** (this will be done for you if you use the Question template).

## Want to contribute a fix or implement a feature?

Great! Here are the things you'll need to know in order to start hacking on the project. While this should cover the general flow, feel free to reach out if anything isn't clear or  you have any questions which are not covered here.

Before starting on any fix, make sure the issue itself is documented in the [issues list](https://github.com/grapoza/vue-tree/issues).

### Grab the code

You can start by forking the [grapoza/vue-tree](https://github.com/grapoza/vue-tree) repository and cloning that fork. If you're unfamiliar with forks, take a look at [GitHub's instructions on how to fork a repository](https://help.github.com/articles/fork-a-repo/). You'll do any development on your own fork and then issue a PR when you're ready for your code to undergo review.

### Get set up

Prerequisites:

- [Yarn](https://yarnpkg.com/) (latest)

Once you have the prerequisites and a local clone of the repository, open a shell to the root of the cloned repo and run `yarn` to install the packages. Once that's done, you can use `yarn build` to build. Other scripts are available in `package.json` for things like running tests or building documentation.

### Implement changes

The three main things you'll update are the code, the tests, and the documentation. How you choose to make these updates is up to you. When your changes are pushed and ready for a PR the expectation is that all changes to these areas are done.

#### Make your code changes

There isn't a huge amount of code in a small library like vue-tree, however some code has been split out to simplify how much code you'll need to sift through to make your changes. For instance, most code related to implementing the ARIA recomendations for accessibile tree views is split into composables used by the main component .vue files. (Note: Some of the composables are a bit kludgy due to porting from Vue 2 mixins.) If you find yourself writing a sizable amount of code for something that may benefit from such a split, bring it up in the conversation for the issue you're working on.

This project includes an `.editorconfig` which should help with basic formatting. In addition to these few rules, keep the [Vue Style Guide](https://vuejs.org/style-guide/) in mind when making changes to the components.

#### Update the tests

Unit tests are written as Vitest specs. The spec files are split into separate files based on broad concerns. Each component has a main spec file containing tests for top level concerns like defaults and property usage. Further separation may be done if the size of a test file becomes burdensome (_e.g._, customizations and interactions are tested in separate files for the TreeViewNode component). If you feel like your changes may benefit from their own test file, bring it up in the conversation for the issue you're working on.

The specs are organized in a fairly standard hierarchy. Each test file should have one outermost `describe` for the component (or the part of the component under test). Within that, another level of `describe`s outline the scenario under test. This may be a top-level `describe` with more specific `describe`s nested inside it. These top-level `describe`s should start with "when" in their descriptions. Nested `describe`s should start with "and" in their descriptions. Finally, `it` is used for the actual test and should start with "should" in their descriptions. For example:

```javascript
describe('myComponent', () => {
    describe('when beeping', () => {
        describe('and booping', () => {
            it('should beep-boop', () => {
            });
        });

        describe('and not booping', () => {
            it('should not beep-boop', () => {
            });
        });
    });
});
```

When writing tests, it's often required to have node data to test with. There's a helper method available in `tests/data/node-generator.ts` that can help with creating various nodes for testing. See existing tests and the comment in that file for examples of how to craft test node data.

In addition to unit tests, the Storybook documentation pages can run locally and provide a way to both document and test changes. You can run `yarn storybook` to start the site. If your changes would make sense with a demonstration, go ahead and add to the demos on this site.

#### Update the documentation

Documentation is created using [Storybook](https://storybook.js.org/). `package.json` includes the `build-storybook-docs` script to build documentation and the `storybook-docs` script to run a a preview of the site for testing. The `src/stories` folder contains the sources you'll edit when making changes or additions to the documentation, and only the sources in this folder get comitted.

### Submit your changes

Once you've made your changes, added tests, and updated the documentation as needed, create a pull request and fill out the information requested.
