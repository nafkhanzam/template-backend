import {RedisPubSub} from "graphql-redis-subscriptions";
import IORedis, {RedisOptions} from "ioredis";
import {env, isDevelopment, isTest} from "./env";
import {MyPubSub} from "./graphql/subscription";

const [redisHost, redisPort] = env.REDIS_HOST_PORT.split(":");
const redisOpt: RedisOptions = {
  host: redisHost,
  port: redisPort ? Number(redisPort) : undefined,
  retryStrategy: isDevelopment() || isTest() ? () => null : undefined,
};
export const redis = new IORedis(redisOpt);
export const pubsub = new MyPubSub(
  new RedisPubSub({
    publisher: new IORedis(redisOpt),
    subscriber: new IORedis(redisOpt),
  }),
);
