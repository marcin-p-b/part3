import globals from "globals";

export default [
  {
    languageOptions: { globals: globals.browser },
    env: {
      node: true,
    },
    overrides: [
      {
        env: {
          node: true,
        },
        files: [".eslintrc.{js,cjs}"],
        parserOptions: {
          sourceType: "script",
        },
      },
    ],
    parserOptions: {
      ecmaVersion: "latest",
    },
    rules: {},
  },
];
