import {createServer} from "@/server";
import supertest from "supertest";
import {db} from "./context";

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

export const apitest = supertest.agent(server.httpServer);
