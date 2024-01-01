#!/usr/bin/env node

import minimist from "minimist";
import { init } from "./init/index.js";

const args = minimist(process.argv.slice(2), {
  boolean: ["init"],
  alias: {
    i: "init",
  },
});

init(args);
