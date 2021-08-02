import {FactoryContext} from "@/context";
import {zod} from "@/lib";
import {Routing} from "express-zod-api";
import _ from "lodash";
import {stringParsers} from "./utils/parsers";

const paginationQuery = zod.object({
  limit: stringParsers.positiveNumber,
  page: stringParsers.positiveNumber,
});

export type BaseApiParams = ConstructorParameters<typeof BaseApi>;
export abstract class BaseApi {
  protected factory: FactoryContext;
  protected authFactory: FactoryContext;
  constructor(factoryOrBase: FactoryContext | BaseApi) {
    if (factoryOrBase instanceof BaseApi) {
      this.factory = factoryOrBase.factory;
      this.authFactory = factoryOrBase.authFactory;
    } else {
      this.factory = factoryOrBase;
      this.authFactory = factoryOrBase.addMiddleware({
        input: zod.object({}),
        middleware: async ({options}) => {
          options.auth();
          return options;
        },
      });
    }
  }

  getRouting(): Routing {
    const {...routings} = this;
    for (const key of Object.keys(routings)) {
      if (key.startsWith("$")) {
        let val = routings[key];
        if (val instanceof BaseApi) {
          val = val.getRouting();
        }
        _.set(routings, [...key.substr(1).split("/"), ""], val);
      }
      delete routings[key];
    }
    return routings as Routing;
  }

  searchPrismaQuery<K extends string | symbol>(
    search: {[key in K]?: string} | undefined,
  ): {where?: Record<K, {contains: string}>} {
    if (!search) {
      return {};
    }
    return {
      where: Object.fromEntries(
        Object.entries(search).map(([key, value]) => [
          key,
          {
            contains: value,
          },
        ]),
      ) as Record<K, {contains: string}>,
    };
  }

  searchInputQuery<V extends zod.AnyZodObject>(
    inputValidator: V,
  ): zod.ZodOptional<ReturnType<V["partial"]>> {
    return inputValidator.partial().optional();
  }

  paginationPrismaQuery(pagination: zod.infer<typeof paginationQuery>) {
    return {
      take: pagination.limit,
      skip: pagination.limit * (pagination.page - 1),
    };
  }

  paginationInputQuery<V extends zod.AnyZodObject>(inputValidator: V) {
    return inputValidator.and(paginationQuery);
  }

  paginationOutput = <T extends zod.ZodTypeAny>(dataListV: T) =>
    zod.object({
      // page: stringParsers.positiveNumber,
      dataList: dataListV.array(),
    });

  [key: string]: unknown;
}
