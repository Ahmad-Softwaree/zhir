"use server";

import { revalidatePath } from "next/cache";
import { ENUMs } from "../enums";
import { URLs } from "../urls";
import { handleServerError } from "../error-handler";
import { del, get, post } from "../config/api.config";

export async function revalidateChats() {
  revalidatePath(ENUMs.TAGS.CHATS);
  revalidatePath(ENUMs.TAGS.CHAT);
}

export async function getChat(id: string) {
  try {
    let data = await get(URLs.GET_CHAT(id), {
      tags: [ENUMs.TAGS.CHAT],
    });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getAllChats() {
  try {
    let data = await get(URLs.GET_ALL_CHATS, { tags: [ENUMs.TAGS.CHATS] });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createNewChat() {
  try {
    let data = await post(URLs.CREATE_NEW_CHAT, {});
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.CHATS);
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function deleteChat(id: string) {
  try {
    let data = await del(URLs.DELETE_CHAT, id);
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.CHATS);
      revalidatePath(ENUMs.TAGS.CHAT);
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}
