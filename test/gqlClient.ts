import {env} from "@/env";
import {Headers} from "cross-fetch";
import {GraphQLClient} from "graphql-request";
import {getSdk} from "./graphql";

global.Headers = global.Headers || Headers;
export const createGqlClient = (headers?: Record<string, string>) =>
  getSdk(new GraphQLClient(`http://localhost:${env.PORT}/graphql`, {headers}));

export const createAuthGqlClient = (token: string) =>
  createGqlClient({Authorization: `Bearer ${token}`});
