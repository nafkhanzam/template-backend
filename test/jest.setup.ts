import {db} from "./context";

beforeAll(async () => {
  await db.$connect();
});

afterAll(async () => {
  await db.$disconnect();
});

beforeEach(async () => {
  // await db.$executeRaw`TRUNCATE TABLE "Account" CASCADE`;
});
