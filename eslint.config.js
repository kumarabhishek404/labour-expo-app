// eslint.config.ts
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
        setTimeout: "readonly", // Add setTimeout as a global variable
        setInterval: "readonly",
        clearInterval: "readonly",
        console: "readonly", // line to define `console` as a global variable
        FormData: "readonly",
        process: "readonly", // Define process as a global variable
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
      "@typescript-eslint/no-unused-vars": "off",
      "react/prop-types": "off", // Use TypeScript for prop types
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
