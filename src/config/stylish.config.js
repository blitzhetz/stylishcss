import path from "node:path";
import { merge } from "../util/merge.js";

const defaultConfig = {
  content: [],
  theme: {},
};

// Merge user and default config before build.
// User need to explicitly set type to module inside package.json

// TODO: Find better way of merging configs so user can use both cjs and mjs type of module.
async function getUserConfig() {
  const userConfigRootPath = process.cwd();
  const userConfigPath = path.resolve(userConfigRootPath, "./stylish.config.js");

  try {
    const userConfigModule = await import(userConfigPath);

    return userConfigModule.default;
  } catch {
    // Testing purpose
    console.log("No user config file. Using default config.");
    return {};
  }
}

const userConfigPromise = getUserConfig();

const configPromise = userConfigPromise.then((userConfig) => {
  const config = merge(defaultConfig, userConfig);
  // Testing purpose
  console.log(config);

  return config;
});

export default configPromise;
