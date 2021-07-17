import {PrismaClient} from ".prisma/client";
import {ApiV1} from "@/api/v1";
import {JWT_COOKIE_KEY} from "@/common";
import {ContextMiddleware, FactoryContext} from "@/context";
import {log} from "@nafkhanzam/backend-utils";
import * as express from "express";
import {
  attachRouting,
  ConfigType,
  EndpointsFactory,
  Routing,
  z,
} from "express-zod-api";
import {BaseApp} from "./base";

export class RestApiApplication extends BaseApp {
  private factory: FactoryContext;
  constructor(db: PrismaClient, getContext: ContextMiddleware) {
    super(db, getContext);
    this.factory = new EndpointsFactory().addMiddleware({
      input: z.object({}).passthrough(),
      middleware: async ({request, response}) => {
        return getContext({req: request, res: response});
      },
    });
  }
  applyMiddleware(app: express.Express): void {
    const config: ConfigType = {
      app,
      cors: true,
      logger: log,
    };

    attachRouting(config, this.getRouting());
  }

  getRouting(): Routing {
    return {
      v1: new ApiV1(this.factory).getRouting(),
    };
  }
}
