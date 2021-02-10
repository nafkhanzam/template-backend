import {PrismaClient} from "@prisma/client";
import {Logger} from "@nafkhanzam/backend-utils";
import {zod} from "@nafkhanzam/common-utils";
import {MyPubSub} from "./graphql/subscription";
import {Redis} from "ioredis";

export enum Role {
  USER = "USER",
}

export const accessTokenJWTValidator = zod
  .object({
    serial: zod.string(),
    role: zod.enum([Role.USER, ...Object.values(Role)]).optional(),
  })
  .nonstrict();

export type AccessTokenJWT = zod.infer<typeof accessTokenJWTValidator>;

export type Context = {
  db: PrismaClient;
  prisma: PrismaClient;
  jwt: AccessTokenJWT | null;
  log: Logger;
  pubsub: MyPubSub;
  redis: Redis;
};
