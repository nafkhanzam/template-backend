import {env} from "@/env";
import {errorUtils, JWTUtils} from "@nafkhanzam/backend-utils";
import {ErrorStatus} from "@nafkhanzam/common-utils";
import {zod} from "@/lib";

export enum Role {
  USER = "USER",
}

export const JWT_COOKIE_KEY = "authorization";

export const accessTokenJWTValidator = zod.object({
  serial: zod.string(),
  role: zod.enum([Role.USER, ...Object.values(Role)]).optional(),
});

export type AccessTokenJWT = zod.infer<typeof accessTokenJWTValidator>;

export const jwtUtils = new JWTUtils(
  accessTokenJWTValidator,
  env.JWT_LOGIN_KEY,
);

export const validJwt = (
  jwt: AccessTokenJWT | null,
  ...roles: Role[]
): AccessTokenJWT => {
  if (!jwt || (roles.length && !roles.includes(jwt.role!))) {
    throw errorUtils.createGQLError(ErrorStatus.NOT_AUTHORIZED);
  }
  return jwt;
};
