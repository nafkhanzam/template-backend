import * as exportGenerator from "export-generator";

exportGenerator.generateExport({
  sourceGlobs: [`${__dirname}/src/graphql/**/*.ts`],
  outputDirectory: `${__dirname}/src/graphql`,
  outputFileName: `index.ts`,
});
