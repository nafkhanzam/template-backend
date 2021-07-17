import {ContextMiddleware} from "@/context";
import {PrismaClient} from "@prisma/client";
import * as express from "express";

export abstract class BaseApp {
  constructor(
    protected db: PrismaClient,
    protected getContext: ContextMiddleware,
  ) {}
  abstract applyMiddleware(app: express.Express): void;
}
