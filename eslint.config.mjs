import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "public/js/md5.js"] },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: { ...globals.browser },
    },
    rules: {
      eqeqeq: "error",
      semi: ["error", "always"],
      "no-unused-vars": "warn",
    },
  },
  {
    // Jest test files run in Node, not the browser
    files: ["tests/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node, ...globals.jest },
    },
  },
];