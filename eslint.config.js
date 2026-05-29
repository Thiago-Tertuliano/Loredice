const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
// const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            // "react-native": reactNativePlugin,
        },
        rules: {
            "react-hooks/exhaustive-deps": "warn",
            // "react-native/no-unused-styles": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_"}],
        },
        settings: {
            react: { version: "detect" },
        },
    }
);