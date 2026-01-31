import { get } from "../config/api.config";
import { ENUMs } from "../enums";
import { handleServerError } from "../error-handler";
import { URLs } from "../urls";

export const getAuth = async () => {
  try {
    let data = await get(URLs.GET_AUTH, {
      tags: [ENUMs.TAGS.AUTH],
    });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
};
