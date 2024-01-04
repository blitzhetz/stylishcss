#!/usr/bin/env node

import minimist from "minimist";
import { init } from "./init/index.js";
import { build } from "./build/index.js";
import { startWatch } from "./build/watch.js";

const args = minimist(process.argv.slice(2), {
  boolean: ["init", "build", "watch"],
  alias: {
    i: "init",
    b: "build",
    w: "watch",
  },
});

// TODO: create a help args command because this is stupid
const shouldRunInit = args.init || (!args.init && !args.build && !args.watch);
const shouldRunBuild = args.build || (!args.init && !args.build && !args.watch);
const shouldWatch = args.watch;

if (shouldRunInit) {
  init(args);
}

if (shouldRunBuild) {
  build(args);
}

if (shouldWatch) {
  startWatch();
}
