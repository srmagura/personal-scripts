#!/usr/bin/env zx

$.verbose = false;

const ignorePatterns = [
  "yarn.lock",
  "apps/app/src/gql/graphql.ts",
  "apps/app/src/gql/gql.ts",
  "libs/core/schema.gql",
];

function testPath(pattern, path) {
  return pattern === path;
}

function parseGitInt(s) {
  if (s === "-") {
    return 0;
  }

  return parseInt(s);
}

const diff = (await $`git diff main --numstat`).stdout;

let insertions = 0;
let deletions = 0;

for (const line of diff.split("\n")) {
  if (!line.trim()) {
    continue;
  }

  const [insertionString, deletionString, path] = line.split("\t");

  if (ignorePatterns.some((pattern) => testPath(pattern, path))) {
    continue;
  }

  insertions += parseGitInt(insertionString);
  deletions += parseGitInt(deletionString);
}

let output =
  "\n    " +
  chalk.bold.green(`+${insertions}`) +
  "    " +
  chalk.red(`-${deletions}`) +
  "\n";

console.log(output);
