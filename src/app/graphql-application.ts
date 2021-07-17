import {ContextMiddleware} from "@/context";
import {schema} from "@/schema";
import {dailyRotateFileLogExtension} from "@nafkhanzam/backend-utils";
import {PrismaClient} from "@prisma/client";
import {ApolloServer} from "apollo-server-express";
import * as express from "express";
import http from "http";
import {BaseApp} from "./base";

export class GraphqlApplication extends BaseApp {
  apolloServer: ApolloServer;
  constructor(db: PrismaClient, getContext: ContextMiddleware) {
    super(db, getContext);
    this.apolloServer = new ApolloServer({
      context: getContext,
      formatError: (err) => ({
        status: err.extensions?.code,
        data: err.extensions?.data,
        ...err,
      }),
      uploads: false,
      plugins: [dailyRotateFileLogExtension],
      schema,
    });
  }
  applyMiddleware(app: express.Express): void {
    this.apolloServer.applyMiddleware({app, cors: true});
  }
  installSubscriptionHandlers(server: http.Server) {
    this.apolloServer.installSubscriptionHandlers(server);
  }
}
