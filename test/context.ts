import {env} from "@/env";
import {createServer} from "@/server";
import {PrismaClient} from "@prisma/client";
import faker from "faker";

export const db = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});

import supertest from "supertest";
import axios from "axios";

Object.defineProperties((supertest as any).Test.prototype, {
  __assertStatus: {
    value: (supertest as any).Test.prototype._assertStatus,
  },
  _assertStatus: {
    value: function (this: any, status: any, res: any) {
      var err = this.__assertStatus(status, res);
      if (err) {
        err.message = `${err.message}\nstatus: ${
          res.status
        }\nresponse: ${JSON.stringify(res.body, null, 2)}`;
      }
      return err;
    },
  },
});

const server = createServer(db);
const apitest = supertest.agent(server.httpServer);
const rand = {
  string: () => faker.random.alphaNumeric(32),
  float: () => faker.datatype.float(0.000001),
  integer: () => faker.datatype.number(),
  date: () => faker.datatype.datetime(),
};

export {apitest, rand, axios};
