import {log, logExtension} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {ApolloServer} from "apollo-server-express";
import express from "express";
import {graphqlUploadExpress} from "graphql-upload";
import http from "http";
import IORedis, {RedisOptions} from "ioredis";
import {createApiEndpoint} from "./api";
import {Context} from "./context";
import {env, isDevelopment} from "./env";
import {pubsub, redis} from "./redis";
import {schema} from "./schema";
import {jwtUtils} from "./utils";

const db = new PrismaClient({
  log: isDevelopment() ? ["info", "warn", "error"] : undefined,
  errorFormat: isDevelopment() ? "pretty" : undefined,
});

const apolloServer = new ApolloServer({
  context: ({req}): Context => {
    return {
      db,
      prisma: db,
      jwt: req ? jwtUtils.headerToJwtObj(req.headers.authorization) : null,
      log,
      pubsub,
      redis,
    };
  },
  formatError: (err) => ({
    status: err.extensions?.code,
    data: err.extensions?.data,
    ...err,
  }),
  uploads: false,
  plugins: [logExtension],
  schema,
});

const app = express();

app.use(express.json());
app.use(graphqlUploadExpress());
app.use(createApiEndpoint(db));
apolloServer.applyMiddleware({app, cors: true});
const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(env.PORT, () => {
  log.info(
    `🚀 GraphQL service ready at http://localhost:${env.PORT}${apolloServer.graphqlPath}`,
  );
  log.info(
    `🚀 Subscriptions ready at ws://localhost:${env.PORT}${apolloServer.subscriptionsPath}`,
  );
});
