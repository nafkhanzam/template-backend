import {env} from "@/env";
import {PrismaClient} from "@prisma/client";

export const db = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
  },
});
