import {log, logExtension} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {ApolloServer} from "apollo-server-express";
import cors from "cors";
import express from "express";
import {graphqlUploadExpress} from "graphql-upload";
import http from "http";
import path from "path";
import {createApiEndpoint} from "./api";
import {Api} from "./client/api";
import {jwtUtils, pubsub, redis} from "./common";
import {DBConfig} from "./config/config";
import {constants} from "./constants";
import {Context} from "./context";
import {schema} from "./schema";
import * as utils from "./common";

export const createServer = (db: PrismaClient) => {
  const apolloServer = new ApolloServer({
    context: ({req}): Context => {
      return {
        db,
        prisma: db,
        jwt: req ? jwtUtils.headerToJwtObj(req.headers.authorization) : null,
        log,
        pubsub,
        redis,
        api: new Api(),
        conf: new DBConfig(db),
        utils,
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

  app.use(cors());
  app.use(express.json());
  app.use(graphqlUploadExpress());
  app.use(createApiEndpoint(db));
  app.use(
    "/" + constants.PUBLIC_FOLDER,
    express.static(path.join(process.cwd(), constants.PUBLIC_FOLDER)),
  );
  apolloServer.applyMiddleware({app, cors: true});
  const httpServer = http.createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  return {apolloServer, httpServer};
};
