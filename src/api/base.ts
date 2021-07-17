import {FactoryContext} from "@/context";
import {AbstractEndpoint, Routing} from "express-zod-api";

export abstract class BaseApi {
  // @ts-expect-error
  constructor(protected factory: FactoryContext) {}

  // @ts-expect-error
  getRouting(): Routing {
    const {factory, getRouting, ...routings} = this;
    return {
      ...routings,
    };
  }

  readonly [k: string]: AbstractEndpoint | Routing;
}
