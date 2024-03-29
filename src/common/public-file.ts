import {constants} from "@/constants";
import {env} from "@/env";
import {PublicFileManager} from "@nafkhanzam/backend-utils";

export const publicFileManager = new PublicFileManager(
  env.BASE_URL,
  constants.UPLOAD_FOLDER,
  {
    signs: "signs",
    documents: "documents",
  },
);
