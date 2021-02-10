import {connectionPlugin, makeSchema} from "nexus";
import {nexusPrisma} from "nexus-plugin-prisma";
import {default as path} from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  plugins: [nexusPrisma(), connectionPlugin()],
  contextType: {
    export: "Context",
    module: path.join(__dirname, "context.ts"),
  },
  nonNullDefaults: {
    input: true,
    output: true,
  },
  outputs: {
    typegen: path.join(
      __dirname,
      "../node_modules/@types/nexus-typegen/index.d.ts",
    ),
    schema: path.join(
      __dirname,
      "../node_modules/@types/nexus-typegen/api.graphql",
    ),
  },
  shouldExitAfterGenerateArtifacts: Boolean(
    process.env.NEXUS_SHOULD_EXIT_AFTER_REFLECTION,
  ),
  types,
});
