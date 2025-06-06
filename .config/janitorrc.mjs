const generated = [
  "**/CHANGELOG.md",
  "packages/**/dist/**",
  "packages/**/docs/**",
  "packages/**/stats/**",
  "node_modules/**",
  "packages/**/node_modules/**",
  "package-lock.json",
  ".yarnrc.yml",
];
const partialGenerated = ["cspell.json", "lerna.json"];

const esFiles = ["*.{cjs,ts,mts}", "packages/**/src/**/*.{ts,tsx,mts}"];
const htmlFiles = ["packages/**/*.html"];
const markdownFiles = ["*.md", "packages/**/*.md"];
const jsonFiles = ["*.json", "packages/**/*.json"];
const yamlFiles = [".circleci/config.yml"];
const prettyFiles = []
  .concat(esFiles)
  .concat(htmlFiles)
  .concat(markdownFiles)
  .concat(jsonFiles)
  .concat(yamlFiles);
const spellingFiles = []
  .concat(esFiles)
  .concat(htmlFiles)
  .concat(markdownFiles)
  .concat(jsonFiles)
  .concat(yamlFiles);

const esFilesExclude = generated;
const htmlFilesExclude = generated;
const markdownFilesExclude = generated;
const jsonFilesExclude = generated;
const yamlFilesExclude = generated;
const prettyFilesExclude = generated.concat(partialGenerated);
const spellingFilesExclude = generated.concat(partialGenerated);

export default {
  lint: {
    esFiles,
    esFilesExclude,
    htmlFiles,
    htmlFilesExclude,
    markdownFiles,
    markdownFilesExclude,
    jsonFiles,
    jsonFilesExclude,
    yamlFiles,
    yamlFilesExclude,
    prettyFiles,
    prettyFilesExclude,
    spellingFiles,
    spellingFilesExclude,
  },
};
