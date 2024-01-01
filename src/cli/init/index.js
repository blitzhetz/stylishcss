import fs from "node:fs/promises";
import path from "node:path";
import url from "node:url";

export async function init(args) {
  const messages = [];

  if (args.init) {
    const cliPath = path.dirname(url.fileURLToPath(import.meta.url));
    const userConfigPath = path.resolve("stylish.config.js");
    const inputCssPath = path.resolve("input.css");

    try {
      await fs.access(userConfigPath, fs.constants.F_OK);
      await fs.access(inputCssPath, fs.constants.F_OK);
      messages.push("input.css already exists.");
      messages.push("stylish.config.js already exists.");
    } catch (error) {
      try {
        const defaultConfigPath = path.join(cliPath, "../../../stubs/stylish.config.js");
        await fs.copyFile(defaultConfigPath, userConfigPath);

        try {
          await fs.access(inputCssPath, fs.constants.F_OK);
          messages.push("input.css already exists.");
        } catch (error) {
          await fs.writeFile(inputCssPath, "");
          messages.push(`Created Stylish input file at: ${inputCssPath}`);
        }

        messages.push(`Created Stylish config file at: ${userConfigPath}`);
      } catch (error) {
        messages.push(`Error copying files: ${error}`);
      }
    }
  } else {
    messages.push("Usage: stylish --init");
  }

  if (messages.length > 0) {
    console.log();
    for (const message of messages) console.log(message);
  }
}
