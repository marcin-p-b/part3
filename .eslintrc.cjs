module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 15,
    sourceType: "module",
  },
  rules: {
    eqeqeq: "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "arrow-spacing": ["error", { before: true, after: true }],
    "no-console": 0,
  },
  plugins: ["@stylistic/js"],
  extends: "eslint:recommended",
  rules: {
    "@stylistic/js/indent": ["error", 2],
    "@stylistic/js/linebreak-style": ["error", "unix"],
    "@stylistic/js/quotes": ["error", "single"],
    "@stylistic/js/semi": ["error", "never"],
  },
};
