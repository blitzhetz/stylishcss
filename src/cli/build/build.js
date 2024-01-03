import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import configPromise from "../../config/stylish.config.js";

// Testing purpose
import colors from "../../lib/colors.js";

export function checkInputCssFile(inputCssPath) {
  return (
    !fs.existsSync(inputCssPath) ||
    fs.readFileSync(inputCssPath, { encoding: "utf-8" }).trim() === ""
  );
}

export function readInputCssFile(inputCssPath) {
  return fs.readFileSync(inputCssPath, { encoding: "utf-8" });
}

export function generateResetCss(join, buildDir, readFileSync, config) {
  // Empty file for now
  const resetPath = join(buildDir, "../../css/reset.css");
  const generateResetCss = () => {
    if (config.reset === false) {
      return "";
    }
    return readFileSync(resetPath, { encoding: "utf8" });
  };
  return generateResetCss();
}

export async function generate(args) {
  const config = await configPromise;

  const rootDir = process.cwd();
  const buildDir = path.dirname(url.fileURLToPath(import.meta.url));
  const inputCssPath = path.resolve(rootDir, "./input.css");
  const distPath = path.resolve(rootDir, "./dist");
  const outputPath = path.resolve(distPath, "stylish.css");

  let modulesToGenerate = [];

  if (!fs.existsSync(inputCssPath) || fs.readFileSync(inputCssPath).length === 0) {
    modulesToGenerate = ["@stylish colors"];
  } else {
    checkInputCssFile(inputCssPath);

    const inputCssContent = readInputCssFile(inputCssPath);

    // STUPID: find a better way
    const keywords = ["@stylish colors"];

    for (const keyword of keywords) {
      if (inputCssContent.includes(keyword)) {
        modulesToGenerate.push(keyword);
      }
    }
  }

  generateResetCss(path.join, buildDir, fs.readFileSync, config);

  const stylishCss = generateCss(modulesToGenerate, buildDir, config);
  const responsiveCss = generateResponsiveCss(stylishCss, config);

  const finalCss = stylishCss + "\n" + responsiveCss;

  writeOutputCssFile(outputPath, finalCss);

  return finalCss;
}

export function generateCss(modulesToGenerate, buildDir, config) {
  const reset = generateResetCss(path.join, buildDir, fs.readFileSync, config);

  // STUPID: this is also stupid :)
  const moduleMappings = {
    "@stylish colors": colors,
  };

  const generatedCss = modulesToGenerate
    .map((keyword) => {
      const module = moduleMappings[keyword];
      if (!module) {
        return "";
      }

      return Object.keys(module)
        .map(
          (selector) =>
            `${selector} {${Object.entries(module[selector])
              .map(([p, v]) => `${p}:${v};`)
              .join("")}}`
        )
        .join("\n");
    })
    .join("\n");

  return `${reset}${generatedCss}`;
}

export function generateResponsiveCss(normalCss, config) {
  return normalCss
    .split("\n")
    .map((line) => {
      const match = line.match(/^\.([a-zA-Z0-9_-]+)(:[a-zA-Z0-9_-]+)*\s*(.*)$/);
      if (!match) return "";

      const [, className, pseudoClass, styles] = match;
      return (
        Object.entries(config.theme.screens)
          .map(([bp, mq]) => `@media ${mq} { .${bp}\\:${className}${pseudoClass || ""} ${styles} }`)
          .join("\n") + "\n"
      );
    })
    .join("");
}

export function writeOutputCssFile(outputPath, stylishCss) {
  const distPath = path.dirname(outputPath);

  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  fs.writeFileSync(outputPath, stylishCss);
}
