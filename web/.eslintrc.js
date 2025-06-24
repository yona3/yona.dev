module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.json",
  },
  env: { browser: true, node: true, es2020: true },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      alias: {
        map: [["@", "./src"]],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    },
  },
  plugins: ["simple-import-sort", "tailwindcss", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:tailwindcss/recommended",
    "next",
    "prettier",
  ],
  rules: {
    "no-console": ["warn", { allow: ["warn", "info", "error"] }],
    "no-restricted-syntax": [
      "error",
      { selector: "TSEnumDeclaration", message: "Don't declare enums" },
      {
        selector: "ClassDeclaration",
        message: "Classes are not allowed. Use functions instead.",
      },
      {
        selector:
          "NewExpression[callee.name!=/^(Date|Error|Map|Set|Promise|URL|URLSearchParams|AbortController|JSDOM)$/]",
        message:
          "The 'new' keyword is not allowed for custom classes. Use factory functions instead.",
      },
    ],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "func-style": ["error", "expression"],
    "no-restricted-imports": [
      "error",
      {
        paths: [{ name: "react", importNames: ["default"] }],
        patterns: [
          {
            group: ["../*", "../../*", "../../../*", "../../../../*"],
            message:
              "Relative imports from parent directories are not allowed. Use '@/*' alias instead.",
          },
        ],
      },
    ],
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
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "tailwindcss/classnames-order": "warn",
    "tailwindcss/no-custom-classname": "warn",
    "tailwindcss/no-contradicting-classname": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
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
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "jsx-a11y/click-events-have-key-events": "off",
    "import/no-relative-packages": "error",
  },
  overrides: [
    {
      files: ["src/app/**/*.tsx", "src/app/**/*.ts"],
      rules: {
        "import/no-default-export": "off",
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
    {
      files: [
        "next.config.js",
        "next.config.ts",
        ".eslintrc.js",
        "tailwind.config.js",
      ],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/naming-convention": "off",
        "no-restricted-imports": "off",
      },
    },
    {
      files: ["src/app/**/*.tsx", "next.config.ts"],
      rules: {
        "no-restricted-syntax": [
          "error",
          { selector: "TSEnumDeclaration", message: "Don't declare enums" },
        ],
      },
    },
  ],
};
