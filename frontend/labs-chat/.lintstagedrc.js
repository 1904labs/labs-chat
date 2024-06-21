const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

const runPrettierCommand = (filenames) =>
  `npx prettier ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")} --write `;

const addChanges = (filenames) =>
  `git add ${filenames.map((f) => f).join(" ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, runPrettierCommand, addChanges],
};
