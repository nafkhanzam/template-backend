import {errorUtils, JWTUtils} from "@nafkhanzam/backend-utils";
import {ErrorStatus, validatorUtils, zod} from "@nafkhanzam/common-utils";
import {AccessTokenJWT, accessTokenJWTValidator, Role} from "./context";
import {env} from "./env";

export const jwtUtils = new JWTUtils(
  accessTokenJWTValidator,
  env.JWT_LOGIN_KEY,
);

export const passwordUtils = (password: string): boolean => {
  if (password.includes(" ")) {
    return false;
  }
  try {
    validatorUtils.validate(zod.string().min(6), password);
  } catch (error) {
    return false;
  }
  return true;
};

export const validJwt = (
  jwt: AccessTokenJWT | null,
  role?: Role,
): AccessTokenJWT => {
  if (!jwt || (role && jwt.role !== role)) {
    throw errorUtils.createGQLError(ErrorStatus.NOT_AUTHORIZED);
  }
  return jwt;
};
