// eslint.config.js
const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: ["node_modules", "build", "dist"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      globals: {
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
    plugins: {
      react,
      "@typescript-eslint": typescript,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...typescript.configs.recommended.rules,
      "react/react-in-jsx-scope": "off", // Only for React 17+
      "@typescript-eslint/no-unused-vars": "warn",
      "react/prop-types": "off", // Use TypeScript for prop types
    },
  },
];
