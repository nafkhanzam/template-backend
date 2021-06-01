import {
  errorUtils,
  JWTUtils,
  PublicFileManager,
} from "@nafkhanzam/backend-utils";
import {ErrorStatus} from "@nafkhanzam/common-utils";
import {AccessTokenJWT, accessTokenJWTValidator, Role} from "./jwt";
import {env} from "@/env";
import {constants} from "@/constants";

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

export const publicFileManager = new PublicFileManager(
  env.PUBLIC_BASE_URL,
  constants.UPLOAD_FOLDER,
  {
    signs: "signs",
    documents: "documents",
  },
);
