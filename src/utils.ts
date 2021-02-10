import {errorUtils, JWTUtils} from "@nafkhanzam/backend-utils";
import {ErrorStatus} from "@nafkhanzam/common-utils";
import {AccessTokenJWT, accessTokenJWTValidator, Role} from "./context";
import {env} from "./env";

export const jwtUtils = new JWTUtils(
  accessTokenJWTValidator,
  env.JWT_LOGIN_KEY,
);

export const validJwt = (
  jwt: AccessTokenJWT | null,
  role?: Role,
): AccessTokenJWT => {
  if (!jwt || (role && jwt.role !== role)) {
    throw errorUtils.createGQLError(ErrorStatus.NOT_AUTHORIZED);
  }
  return jwt;
};
