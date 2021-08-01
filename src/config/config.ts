import {PrismaClient} from "@prisma/client";
import {validatorUtils, zod} from "@nafkhanzam/common-utils";

export type ConfigType<T> = {
  validator: zod.ZodType<T, any>;
  defaultValue: T;
};

const __placeholder__: ConfigType<boolean> = {
  defaultValue: true,
  validator: zod.boolean(),
};

const configs = {
  ok: __placeholder__,
} as const;

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

    const valid = validatorUtils.validateSafe(validator, conf?.value);
    let value = defaultValue;
    if (valid.success) {
      value = valid.data;
    }
    return value;
  }
}
