import { defineConfig, globalIgnores } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
export default defineConfig([
  ...next,
  ...typescript,
  globalIgnores([
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".next/**",
    "asset/**",
    "assets/**",
    "next-env.d.ts",
    "LoboStudio_Codex_Kit_v0.1/**",
    "_archive/**",
    "playwright-report/**",
  ]),
]);
