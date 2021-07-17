import {accessTokenJWTValidator} from "@/common";
import {zod} from "@/lib";
import {BaseApi} from "../base";

export class ApiV1 extends BaseApi {
  readonly hello = this.factory.build({
    method: "get",
    input: zod.object({}),
    output: zod.object({
      jwt: accessTokenJWTValidator.nullable(),
      raw: zod.string().nullable(),
    }),
    handler: async ({options, logger}) => {
      logger.info("test log");
      return {jwt: options.jwt, raw: options.jwtRaw};
    },
  });
}
