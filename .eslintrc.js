module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ["*.js"],
    rules: {
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "comma-dangle": ["error", "never"],
        "no-trailing-spaces": "error",
        "no-multiple-empty-lines": "error",
        "curly": ["error", "all"],
        "brace-style": ["error", "1tbs"],
        "object-curly-spacing": ["error", "never"],
        "array-bracket-spacing": ["error", "never"],
        "keyword-spacing": ["error", {"before": true}],
        "comma-spacing": ["error", {"before": false, "after": true }],
        "space-infix-ops": ["error", {"int32Hint": false}],
        "no-useless-computed-key": "error",
        "no-throw-literal": "error",
        "no-whitespace-before-property": "error",
        "no-this-before-super": "error",
        "no-shadow-restricted-names": "error",
        "no-sparse-arrays": "error",
        "lines-between-class-members": [
            "error",
            "always",
            {"exceptAfterSingleLine": true},
        ],
        "no-console": "warn",
    }
};
