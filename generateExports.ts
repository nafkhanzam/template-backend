import * as exportGenerator from "export-generator";

exportGenerator.generateExport({
  sourceGlobs: [`${__dirname}/src/graphql/**/*.ts`],
  outputDirectory: `${__dirname}/src/graphql`,
  outputFileName: `index.ts`,
});

exportGenerator.generateExport({
  sourceGlobs: [`${__dirname}/src/common/**/*.ts`],
  outputDirectory: `${__dirname}/src/common`,
  outputFileName: `index.ts`,
});
