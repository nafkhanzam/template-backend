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
import {jwtUtils, JWT_COOKIE_KEY, validJwt} from "./common";
import {DBConfig} from "./config/config";
import {constants} from "./constants";
import {ContextMiddleware} from "./context";
import * as utils from "@/common";
import cookieParser from "cookie-parser";

type ReturnContext = {
  graphqlAppPromise: Promise<GraphqlApplication> | null;
  restApiApp: RestApiApplication | null;
  httpServer: http.Server;
};

export const getGetContext =
  (db: PrismaClient): ContextMiddleware =>
  ({req, res}) => {
    const jwtRaw =
      (req.cookies[JWT_COOKIE_KEY] || req.headers[JWT_COOKIE_KEY]) ?? null;
    const jwt = jwtRaw ? jwtUtils.headerToJwtObj(jwtRaw) : null;
    return {
      db,
      prisma: db,
      jwt,
      jwtRaw,
      log,
      api: new ClientApi(),
      conf: new DBConfig(db),
      utils,
      req,
      res,
      auth: (...roles) => validJwt(jwt, ...roles),
    };
  };

export const createServer = (db: PrismaClient): ReturnContext => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  app.use(graphqlUploadExpress());

  const getContext = getGetContext(db);

  const restApiApp = new RestApiApplication(db, getContext);
  restApiApp.applyMiddleware(app);

  app.use(
    constants.PUBLIC_URL,
    express.static(path.join(process.cwd(), constants.PUBLIC_FOLDER)),
  );

  app.use((req, res) => {
    res.status(404);

    if (req.accepts("json")) {
      res.json({error: "Not found"});
      return;
    }

    res.type("txt").send("Not found");
  });

  const httpServer = http.createServer(app);

  const graphqlApp = new GraphqlApplication(db, getContext);
  const graphqlAppPromise = new Promise<GraphqlApplication>(async (resolve) => {
    await graphqlApp.apolloServer.start();
    graphqlApp.applyMiddleware(app);
    resolve(graphqlApp);
  });

  return {graphqlAppPromise, restApiApp, httpServer};
};
