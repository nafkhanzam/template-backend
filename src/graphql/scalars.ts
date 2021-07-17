import {FileUpload, GraphQLUpload} from "graphql-upload";
import {asNexusMethod} from "nexus";
import path from "path";

if (!GraphQLUpload) {
  console.error("GraphQLUpload is undefined!");
  process.exit(1);
}

export type UploadType = {
  file?: FileUpload;
  promise: Promise<FileUpload>;
};

export const Upload = asNexusMethod(GraphQLUpload, "upload", {
  export: "UploadType",
  module: path.join(process.cwd(), "src/graphql/scalars.ts"),
});
