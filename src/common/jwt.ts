import {zod} from "@nafkhanzam/common-utils";

export enum Role {
  USER = "USER",
}

export const accessTokenJWTValidator = zod.object({
  serial: zod.string(),
  role: zod.enum([Role.USER, ...Object.values(Role)]).optional(),
});

export type AccessTokenJWT = zod.infer<typeof accessTokenJWTValidator>;
