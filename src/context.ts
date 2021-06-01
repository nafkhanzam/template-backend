import {PrismaClient} from "@prisma/client";
import {Logger} from "@nafkhanzam/backend-utils";
import {zod} from "@nafkhanzam/common-utils";
import {MyPubSub} from "./graphql/subscription";
import {Redis} from "ioredis";
import {Api} from "./client/api";
import {DBConfig} from "./config/config";
import {AccessTokenJWT} from "./common/jwt";

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  jwt: AccessTokenJWT | null;
  log: Logger;
  pubsub: MyPubSub;
  redis: Redis;
  api: Api;
  conf: DBConfig;
};
