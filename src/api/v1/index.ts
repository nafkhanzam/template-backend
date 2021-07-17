import {Routing} from "express-zod-api";
import {BaseApi} from "../base";

export class ApiV1 extends BaseApi {
  getRouting(): Routing {
    return {};
  }
}
