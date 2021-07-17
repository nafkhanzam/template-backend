import {log} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {createServer} from "./server";
import {env, isDevelopment} from "./env";

const db = new PrismaClient({
  log: isDevelopment() ? ["info", "warn", "error"] : undefined,
  errorFormat: isDevelopment() ? "pretty" : undefined,
});

(async () => {
  const {apolloServer, httpServer} = await createServer(db);

  httpServer.listen(env.PORT, () => {
    if (apolloServer) {
      if (apolloServer.graphqlPath) {
        log.info(
          `🚀 GraphQL service ready at http://localhost:${env.PORT}${apolloServer.graphqlPath}`,
        );
      }
      // if (apolloServer.subscriptionsPath) {
      //   log.info(
      //     `🚀 Subscriptions ready at ws://localhost:${env.PORT}${apolloServer.subscriptionsPath}`,
      //   );
      // }
    }
  });
})();
