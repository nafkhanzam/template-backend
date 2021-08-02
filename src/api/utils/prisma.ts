import {Prisma} from "@prisma/client";
import {errors} from "./errors";

export const prismaUtils = {
  catchHttpNotFound: (modelName: string, id: number) => (err: unknown) => {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      (err.code === "P2025" || err.code === "P2018")
    ) {
      throw errors.notFoundById(modelName, id);
    }
    throw err;
  },
};
