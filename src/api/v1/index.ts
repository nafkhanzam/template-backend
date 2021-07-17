import {accessTokenJWTValidator} from "@/common";
import {zod} from "@/lib";
import {Routing} from "express-zod-api";
import {BaseApi} from "../base";

export class ApiV1 extends BaseApi {
  getRouting(): Routing {
    return {
      hello: this.hello,
    };
  }

  hello = this.factory.build({
    method: "get",
    input: zod.object({}).passthrough(),
    output: zod.object({
      jwt: accessTokenJWTValidator.nullable(),
    }),
    handler: async ({options, logger}) => {
      logger.info("test log");
      return {jwt: options.jwt};
    },
  });
}
