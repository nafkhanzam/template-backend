import {createTestClient} from "apollo-server-integration-testing";
import {DocumentNode} from "graphql";
import {getSdk, Requester} from "./graphql";

const validDocDefOps = ["mutation", "query", "subscription"];

type TestClient = ReturnType<typeof createTestClient>;

export function getSdkApollo(client: TestClient) {
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

    switch (definition.operation) {
      case "mutation": {
        const response = await client.mutate(doc, {variables: variables ?? {}});

        if (response.errors) {
          throw response;
        }

        if (response.data === undefined || response.data === null) {
          throw new Error("No data presented in the GraphQL response");
        }

        return response.data as any;
      }
      case "query": {
        const response = await client.query(doc, {
          variables: variables ?? {},
        });

        if (response.errors) {
          throw response;
        }

        if (response.data === undefined || response.data === null) {
          throw new Error("No data presented in the GraphQL response");
        }

        return response.data as any;
      }
      case "subscription": {
        throw new Error(
          "Subscription requests through SDK interface are not supported",
        );
      }
    }
  };

  return getSdk(requester);
}

export type Sdk = ReturnType<typeof getSdkApollo>;
