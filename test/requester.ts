import {ApolloServer} from "apollo-server-express";
import {DocumentNode} from "graphql";
import {Headers} from "apollo-server-env";
import {getSdk, Requester} from "./graphql";

const validDocDefOps = ["mutation", "query", "subscription"];

export function getSdkApollo(
  client: ApolloServer,
  headers: Record<string, string> = {},
) {
  const requester: Requester = async <R, V>(
    doc: DocumentNode,
    variables?: V,
  ): Promise<R> => {
    // Valid document should contain *single* query or mutation unless it's has a fragment
    if (
      doc.definitions.filter(
        (d) =>
          d.kind === "OperationDefinition" &&
          validDocDefOps.includes(d.operation),
      ).length !== 1
    ) {
      throw new Error(
        "DocumentNode passed to Apollo Client must contain single query or mutation",
      );
    }

    const definition = doc.definitions[0];

    // Valid document should contain *OperationDefinition*
    if (definition.kind !== "OperationDefinition") {
      throw new Error(
        "DocumentNode passed to Apollo Client must contain single query or mutation",
      );
    }

    const httpHeaders = new Headers();
    for (const [key, value] of Object.entries(headers)) {
      httpHeaders.append(key, value);
    }
    const response = await client.executeOperation({
      operationName: definition.operation,
      query: doc,
      variables: variables ?? {},
      http: {
        method: "POST",
        headers: httpHeaders,
        url: client.graphqlPath,
      },
    });

    if (response.errors) {
      throw response;
    }

    if (response.data === undefined || response.data === null) {
      throw new Error("No data presented in the GraphQL response");
    }

    return response.data as any;
  };

  return getSdk(requester);
}

export type Sdk = ReturnType<typeof getSdkApollo>;
