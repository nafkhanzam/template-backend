import {createHttpError} from "@/lib";

export const errors = {
  notFoundById: (modelName: string, id: number) =>
    new createHttpError.NotFound(`${modelName} with id ${id} is not found!`),
};
