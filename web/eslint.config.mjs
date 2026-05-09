import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: [
      "**/node_modules/**",
      "**/out/**",
      "**/.next/**",
      "eslint.config.mjs",
      "next.config.ts",
    ],
  },

  // Base JavaScript recommended config
  js.configs.recommended,

  // JavaScript config files (CommonJS)
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // TypeScript files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        sourceType: "module",
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        React: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      react: fixupPluginRules(react),
      "react-hooks": reactHooks,
      "jsx-a11y": fixupPluginRules(jsxA11y),
      "simple-import-sort": simpleImportSort,
      "@next/next": nextPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // ESLint core rules
      "no-console": ["warn", { allow: ["warn", "info", "error"] }],
      "no-restricted-syntax": [
        "error",
        { selector: "TSEnumDeclaration", message: "Don't declare enums" },
      ],
      "prefer-arrow-callback": "error",
      "prefer-const": "error",
      "func-style": ["error", "expression"],
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "react", importNames: ["default"] }] },
      ],

      // React rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "error",
      "react/jsx-handler-names": [
        "error",
        {
          eventHandlerPrefix: "handle",
          eventHandlerPropPrefix: "on",
          checkLocalVariables: true,
          checkInlineFunction: true,
        },
      ],

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
        {
          selector: ["property", "parameterProperty", "method"],
          format: ["camelCase"],
        },
        {
          selector: "variable",
          types: ["boolean"],
          format: ["PascalCase"],
          prefix: ["is", "has", "should"],
        },
      ],

      // JSX A11y rules
      "jsx-a11y/anchor-is-valid": [
        "error",
        {
          components: ["Link"],
          specialLink: ["hrefLeft", "hrefRight"],
          aspects: ["invalidHref", "preferButton"],
        },
      ],
      "jsx-a11y/click-events-have-key-events": "off",

      // Next.js rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // App directory overrides
  {
    files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
    rules: {
      "func-style": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: ["typeAlias", "typeParameter"], format: ["PascalCase"] },
        {
          selector: ["property", "parameterProperty", "method"],
          format: ["camelCase"],
          filter: { regex: "^__html$", match: false },
        },
      ],
    },
  },

  // Config files override
  {
    files: ["*.config.{js,ts,mjs}", "*.config.*.{js,ts,mjs}"],
    rules: {
      "@typescript-eslint/naming-convention": "off",
    },
  },

  // Prettier compatibility (should be last)
  eslintConfigPrettier,
];
