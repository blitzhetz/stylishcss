import path from "node:path";
import { generate, writeOutputCssFile } from "./build.js";

export async function build(args) {
  const messages = [];

  if (args.build) {
    console.time("Time");
    const rootDir = process.cwd();
    const distPath = path.resolve(rootDir, "./dist");
    const outputPath = path.resolve(distPath, "stylish.css");

    try {
      messages.push("Generating stylish.css...");

      const generateCss = await generate(args);
      writeOutputCssFile(outputPath, generateCss);

      messages.push("stylish.css has been generated successfully.");
      console.timeEnd("Time");
    } catch (error) {
      messages.push(`Error generating stylish.css: ${error.message}`);
    }
  } else {
    messages.push("Usage: stylish --build");
  }

  if (messages.length > 0) {
    console.log();
    for (const message of messages) {
      console.log(message);
    }
  }
}
