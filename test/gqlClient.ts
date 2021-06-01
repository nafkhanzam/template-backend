import {createServer} from "@/apollo-server";
import {createTestClient} from "apollo-server-integration-testing";
import {Headers} from "cross-fetch";
import {db} from "@test/context";
import {getSdkApollo} from "@test/requester";

const {apolloServer} = createServer(db);

global.Headers = global.Headers || Headers;
export const createGqlClient = (headers?: Record<string, string>) =>
  getSdkApollo(
    createTestClient({
      apolloServer,
      extendMockRequest: {headers},
    }),
  );

export const createAuthGqlClient = (token: string) =>
  createGqlClient({Authorization: `Bearer ${token}`});

export const gqlClient = createGqlClient();
