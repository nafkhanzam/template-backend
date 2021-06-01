import {RedisPubSub} from "graphql-redis-subscriptions";
import IORedis, {RedisOptions} from "ioredis";
import {env, isDevelopment, isTest} from "../env";
import {MyPubSub} from "../graphql/subscription";

const rawRedisHost = env.REDIS_HOST?.includes(":")
  ? env.REDIS_HOST
  : env.REDIS_HOST + ":";

const [redisHost, redisPort] = rawRedisHost.split(":");
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
