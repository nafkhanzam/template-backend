import {log} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {env, isDevelopment} from "./env";
import {createServer} from "./server";

const db = new PrismaClient({
  log: isDevelopment() ? ["info", "warn", "error"] : undefined,
  errorFormat: isDevelopment() ? "pretty" : undefined,
});

(async () => {
  const {graphqlAppPromise, restApiApp, httpServer} = createServer(db);
  const graphqlApp = await graphqlAppPromise;

  if (!!process.env.GENERATE_OPEN_API) {
    if (restApiApp) {
      await restApiApp.generateOpenApi();
    } else {
      throw new Error("Rest API Application is not found!");
    }
  } else {
    httpServer.listen(env.PORT, () => {
      log.info(`🚀 Rest API Service is ready at http://localhost:${env.PORT}`);

      const graphqlPath = graphqlApp?.apolloServer?.graphqlPath;
      if (graphqlPath) {
        log.info(
          `🚀 GraphQL Service is ready at http://localhost:${env.PORT}${graphqlPath}`,
        );
      }
    });
  }
})();
