import {Context} from "@/context";
import {Routing} from "express-zod-api";

export abstract class BaseApi {
  constructor(protected ctx: Context) {}
  abstract getRouting(): Routing;
}
