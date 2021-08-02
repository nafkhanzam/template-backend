import {hashUtils} from "@nafkhanzam/backend-utils";
import {apitest, axios, db} from "./context";

beforeAll(async () => {
  await db.$connect();

  const res = await db.$queryRaw<{table_name: string}[]>(
    `SELECT table_name FROM information_schema.tables where table_schema = 'public'`,
  );
  await db.$transaction(
    res.map((v) => db.$executeRaw(`TRUNCATE TABLE "${v.table_name}" CASCADE`)),
  );

  const username = "admin";
  const password = "password";
  const passwordHash = await hashUtils.hash(password);

  await db.user.create({
    data: {
      username,
      passwordHash,
    },
  });

  // TODO: Login using agent

  // await apitest.post("/v1/auth/login").send({username, password});
});

afterAll(async () => {
  await db.$disconnect();
});
