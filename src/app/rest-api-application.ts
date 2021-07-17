import {PrismaClient} from ".prisma/client";
import {ApiV1} from "@/api/v1";
import {constants} from "@/constants";
import {ContextMiddleware, FactoryContext} from "@/context";
import {env} from "@/env";
import {pkg} from "@/lib";
import {log} from "@nafkhanzam/backend-utils";
import * as express from "express";
import {
  attachRouting,
  ConfigType,
  EndpointsFactory,
  OpenAPI,
  Routing,
  z,
} from "express-zod-api";
import fs from "fs-extra";
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

  async generateOpenApi() {
    const spec = new OpenAPI({
      routing: this.getRouting(),
      title: pkg.name,
      version: pkg.version,
      serverUrl: `${env.PUBLIC_BASE_URL}`,
    }).builder.getSpecAsYaml();
    await fs.ensureFile(constants.OPENAPI_YAML);
    await fs.writeFile(constants.OPENAPI_YAML, spec, "utf8");
  }
}
