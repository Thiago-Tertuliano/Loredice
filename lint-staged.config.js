module.exports = {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", () => "tsc --noEmit"],
    "*.{json,md}": ["prettier --write"],
};
