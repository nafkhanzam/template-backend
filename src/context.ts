import {Logger} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {Redis} from "ioredis";
import {ClientApi} from "./client/api";
import {AccessTokenJWT} from "./common";
import {DBConfig} from "./config/config";
import {MyPubSub} from "./graphql/subscription";
import * as utils from "./common";
import * as express from "express";

export type ContextMiddleware = (conn: {
  req: express.Request;
  res: express.Response;
}) => Context;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  jwt: AccessTokenJWT | null;
  log: Logger;
  pubsub: MyPubSub;
  redis: Redis;
  api: ClientApi;
  conf: DBConfig;
  utils: typeof utils;
};
