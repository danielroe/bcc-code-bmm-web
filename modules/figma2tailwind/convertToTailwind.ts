// @ts-nocheck - This script should fail if anything is wrong and someone needs to have a look at it manually anyways.

import { promises as fs } from "fs";
import generateStylesAndConfig from "./colorsToVariables";

const shouldNotHaveSuffix = (theme) => ["light", "global"].includes(theme);

async function writeTailwindConfig(content: string) {
  await fs.writeFile(
    "./tailwind.config.ts",
    `/**
 * ---------------------------------------------------
 * 👷 Generated by figma2tailwind. Do not modify !
 * ---------------------------------------------------
 * */
import type { Config } from "tailwindcss";

${content}

const config: Partial<Config> = {
  darkMode: "class",
  theme: {
    colors,
    extend: {  
      gridTemplateColumns: {
        tracklist: "2.5rem 1fr 1fr 50px 144px" 
      }
    }
  },
};

export default config;
`,
    "utf8",
  );
}

async function writeColorsCss(content: string) {
  await fs.writeFile("./assets/colors.css", content, "utf8");
}

async function writeColors(figmaInput) {
  const { color } = figmaInput;
  const transformedColors = {};

  Object.entries(color).forEach(([theme, themeValue]) => {
    Object.entries(themeValue).forEach(([colorKey, colorValue]) => {
      const suffixedKey = shouldNotHaveSuffix(theme)
        ? colorKey
        : `${colorKey}-${theme}`;

      if (!colorValue.value) {
        transformedColors[suffixedKey] ||= {};

        Object.entries(colorValue).forEach(
          ([innerColorWeight, innerColorValue]) => {
            transformedColors[suffixedKey][innerColorWeight] =
              innerColorValue.value;
          },
        );
      } else {
        transformedColors[suffixedKey] = colorValue.value;
      }
    });
  });

  // Simplifies class names so bg-info-default becomes bg-info
  const colors = JSON.parse(
    JSON.stringify(transformedColors).replaceAll("default", "DEFAULT"),
  );

  const { cssString, tailwindColors } = generateStylesAndConfig(colors);

  await writeColorsCss(cssString);

  const content = `const colors = ${JSON.stringify(tailwindColors, null, 2)};`;

  await writeTailwindConfig(content);
}

async function getFigmaInput() {
  const content = await fs.readFile(
    "./assets/design-tokens/tokens.json",
    "utf-8",
  );
  return JSON.parse(content);
}

export default async function main() {
  const figmaInput = await getFigmaInput();
  await writeColors(figmaInput);
}
