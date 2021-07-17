import {GraphqlApplication} from "@/app/graphql-application";
import {getGetContext} from "@/server";
import {db} from "@test/context";
import {getSdkApollo} from "@test/requester";
import {Headers} from "cross-fetch";

const getContext = getGetContext(db);
const graphqlApp = new GraphqlApplication(db, getContext);

global.Headers = global.Headers || Headers;
export const createGqlClient = (headers?: Record<string, string>) =>
  getSdkApollo(graphqlApp.apolloServer, headers);

export const createAuthGqlClient = (token: string) =>
  createGqlClient({Authorization: `Bearer ${token}`});

export const gqlClient = createGqlClient();
