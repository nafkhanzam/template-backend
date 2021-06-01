import {Logger} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {Redis} from "ioredis";
import {Api} from "./client/api";
import {AccessTokenJWT} from "./common";
import {DBConfig} from "./config/config";
import {MyPubSub} from "./graphql/subscription";
import * as utils from "./common";

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  jwt: AccessTokenJWT | null;
  log: Logger;
  pubsub: MyPubSub;
  redis: Redis;
  api: Api;
  conf: DBConfig;
  utils: typeof utils;
};
