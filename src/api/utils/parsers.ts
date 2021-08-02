import {zod} from "@/lib";

const numberQuery = zod
  .string()
  .nonempty()
  .transform((v) => Number(v))
  .refine((v) => !isNaN(v));

const positiveNumberQuery = numberQuery.refine(
  (v) => v > 0,
  `must be positive non-zero`,
);

const date = zod.string().refine((v) => zod.date().parse(new Date(v)));

export const stringParsers = {
  number: numberQuery,
  positiveNumber: positiveNumberQuery,
  date,
};

type EnumLike = {
  [k: string]: string | number;
  [nu: number]: string;
};

export const parsers = {
  id: ":id",
  idParser: zod.object({id: numberQuery}),
  fieldId: ":fieldId",
  fieldIdParser: zod.object({fieldId: numberQuery}),
  type: ":type",
  typeParserFn: <T extends EnumLike>(type: T) =>
    zod.object({type: zod.nativeEnum(type)}),
};

export const models = {
  uploadFileInput: zod.object({
    fileName: zod.string(),
  }),
  uploadFileOutput: zod.object({
    uploadUrl: zod.string(),
  }),
  acquisitionFileOutput: zod.object({
    id: zod.number(),
    fileName: zod.string(),
    fileFormat: zod.string(),
    remark: zod.string(),
    timeStamp: zod.date(),
    acquisitionTime: zod.date(),
    fileUrl: zod.string(),
  }),
};
