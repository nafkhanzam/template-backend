import {env} from "@/env";
import {PrismaClient} from "@prisma/client";
import faker from "faker";

export const db = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

import axios from "axios";

const rand = {
  string: () => faker.random.alphaNumeric(32),
  float: () => faker.datatype.float(0.000001),
  integer: () => faker.datatype.number(),
  date: () => faker.datatype.datetime(),
};

export {rand, axios};
