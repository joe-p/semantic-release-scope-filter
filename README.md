# semantic-release-scope-filter

This is a `semantic-release` plugin that enables filtering of commit messages BEFORE they get ingested by semantic-release. This means all commits filtered out by this plugin will not be visible to any other plugin. This is particularly useful for monorepos where you are performing releases based on commit scopes.

## Installation

This package is available on npm as [semantic-release-scope-filter](https://www.npmjs.com/package/semantic-release-scope-filter) and can be installed via any package manager

## Usage

In your [semantic-release configuration](https://semantic-release.gitbook.io/semantic-release/usage/configuration) add this plugin with an array of scopes to allow through the filter:

```js
[
  "semantic-release-scope-filter",
  {
    scopes: ["package_name"],
  },
],
```

### Commits Without A Scope

By default, all commits without a scope are allowed through the filter. To filter out these commits, set `filterOutMissingScope` to true in the plugin configuration.

## How It Works

This plugin uses monkey-patching to patch [git-log-parser](https://www.npmjs.com/package/git-log-parser), which is what semantic-release uses to get all the commits before calling the `analyzeCommit` lifecycle method.

## Credits

[folke/semantic-release-commit-filter](https://github.com/folke/semantic-release-commit-filter/tree/master) for showing how to monkey patch node's module cache
