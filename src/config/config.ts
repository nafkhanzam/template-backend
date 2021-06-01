import {PrismaClient} from "@prisma/client";
import {validatorUtils, zod} from "@nafkhanzam/common-utils";

export type ConfigType<T> = {
  validator: zod.ZodType<T, any>;
  defaultValue: T;
};

const configs = {} as const;

export class DBConfig {
  constructor(private db: PrismaClient) {}

  async get<T extends keyof typeof configs>(
    key: T,
  ): Promise<typeof configs[T]["defaultValue"]> {
    const {defaultValue, validator} = configs[key];
    const conf = await this.db.config.findUnique({
      where: {
        key,
      },
      rejectOnNotFound: false,
    });

    // TODO: Find better solution!
    const valid = validatorUtils.validateSafe(validator, conf?.value);
    let value = defaultValue;
    if (valid.success) {
      // @ts-expect-error need to find solution
      value = valid.data;
    }
    return value;
  }
}
