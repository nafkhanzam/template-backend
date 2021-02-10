import {PrismaClient} from "@prisma/client";
import {Router} from "express";

export const createV1Endpoint = (db: PrismaClient) => {
  const router = Router();

  return router;
};
