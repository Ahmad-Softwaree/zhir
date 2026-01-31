"use server";

import { get, post } from "../config/api.config";
import { ENUMs } from "../enums";
import { handleServerError } from "../error-handler";
import { URLs } from "../urls";

export const getPayments = async () => {
  try {
    let data = await get(URLs.GET_PAYMENTS, {
      tags: [ENUMs.TAGS.PAYMENTS],
    });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
};

export const addPayment = async () => {
  try {
    let data = await post(URLs.ADD_PAYMENT, {
      tags: [ENUMs.TAGS.PAYMENTS],
    });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
};
