import {Logger} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import * as express from "express";
import {EndpointsFactory} from "express-zod-api";
import {ClientApi} from "./client/api";
import * as utils from "./common";
import {AccessTokenJWT} from "./common";
import {DBConfig} from "./config/config";

export type ContextMiddleware = (conn: {
  req: express.Request;
  res: express.Response;
}) => Context;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  jwt: AccessTokenJWT | null;
  jwtRaw: string | null;
  log: Logger;
  api: ClientApi;
  conf: DBConfig;
  utils: typeof utils;
};

export type FactoryContext = EndpointsFactory<{}, Context>;
