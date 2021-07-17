import {log} from "@nafkhanzam/backend-utils";
import * as express from "express";
import {attachRouting, ConfigType, Routing} from "express-zod-api";
import {BaseApp} from "./base";

export class RestApiApplication extends BaseApp {
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
      v1: {},
    };
  }
}
