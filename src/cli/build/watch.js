import chokidar from "chokidar";
import { build } from "./index.js";
import configPromise from "../../config/stylish.config.js";

export async function startWatch(args) {
  const config = await configPromise;
  const watcher = chokidar.watch(config.content, {
    ignoreInitial: true,
  });

  watcher.on("all", (event, path) => {
    console.log("Watch currently doesn't work as intended...");
    console.log(`File ${path} has been changed. Rebuilding...`);
    build({ build: true, ...args });
  });

  console.log("Watching for file changes. Press Ctrl+C to exit.");
}
