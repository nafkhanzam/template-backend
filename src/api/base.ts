import {FactoryContext} from "@/context";
import {Routing} from "express-zod-api";

export abstract class BaseApi {
  constructor(protected factory: FactoryContext) {}
  abstract getRouting(): Routing;
}
