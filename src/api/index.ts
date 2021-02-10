import {PrismaClient} from "@prisma/client";
import {Router} from "express";
import {createV1Endpoint} from "./v1";

export const createApiEndpoint = (db: PrismaClient) => {
  const router = Router();

  router.use("/v1", createV1Endpoint(db));

  return router;
};
