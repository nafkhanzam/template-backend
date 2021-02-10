import {PubSubEngine} from "apollo-server-express";

export class MyPubSub {
  constructor(private pubsub: PubSubEngine) {}
}
