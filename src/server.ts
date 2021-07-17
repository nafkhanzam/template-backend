import {log} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import cors from "cors";
import express from "express";
import {graphqlUploadExpress} from "graphql-upload";
import http from "http";
import path from "path";
import {GraphqlApplication} from "./app/graphql-application";
import {RestApiApplication} from "./app/rest-api-application";
import {ClientApi} from "./client/api";
import {jwtUtils, JWT_COOKIE_KEY} from "./common";
import {DBConfig} from "./config/config";
import {constants} from "./constants";
import {ContextMiddleware} from "./context";
import * as utils from "@/common";

type ReturnContext = {
  graphqlApp: GraphqlApplication | null;
  restApiApp: RestApiApplication | null;
  httpServer: http.Server;
};

export const getGetContext =
  (db: PrismaClient): ContextMiddleware =>
  ({req}) => {
    return {
      db,
      prisma: db,
      jwt: req ? jwtUtils.headerToJwtObj(req.headers[JWT_COOKIE_KEY]) : null,
      jwtRaw: req.headers[JWT_COOKIE_KEY] ?? null,
      log,
      api: new ClientApi(),
      conf: new DBConfig(db),
      utils,
    };
  };

export const createServer = async (
  db: PrismaClient,
): Promise<ReturnContext> => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(graphqlUploadExpress());

  const getContext = getGetContext(db);

  const restApiApp = new RestApiApplication(db, getContext);
  restApiApp.applyMiddleware(app);

  app.use(
    constants.PUBLIC_URL,
    express.static(path.join(process.cwd(), constants.PUBLIC_FOLDER)),
  );

  const httpServer = http.createServer(app);

  const graphqlApp = new GraphqlApplication(db, getContext);
  await graphqlApp.apolloServer.start();
  graphqlApp.applyMiddleware(app);

  return {graphqlApp, restApiApp, httpServer};
};
