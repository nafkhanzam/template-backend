import {log} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {createServer} from "./apollo-server";
import {env, isDevelopment} from "./env";

const db = new PrismaClient({
  log: isDevelopment() ? ["info", "warn", "error"] : undefined,
  errorFormat: isDevelopment() ? "pretty" : undefined,
});

const {apolloServer, httpServer} = createServer(db);

httpServer.listen(env.PORT, () => {
  log.info(
    `🚀 GraphQL service ready at http://localhost:${env.PORT}${apolloServer.graphqlPath}`,
  );
  log.info(
    `🚀 Subscriptions ready at ws://localhost:${env.PORT}${apolloServer.subscriptionsPath}`,
  );
});
