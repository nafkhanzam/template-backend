module.exports = {
  backend: {
    generator: "nexus-plugin-prisma",
    output: "src/graphql/models",
    disableQueries: true,
    disableMutations: true,
  },
};
