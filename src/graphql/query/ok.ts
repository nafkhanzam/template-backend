import {extendType} from "nexus";

const field = "ok";

export const query_ok = extendType({
  type: "Query",
  definition(t) {
    t.field(field, {
      type: "Boolean",
      resolve: () => true,
    });
  },
});
