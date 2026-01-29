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

export async function getBlog(id: string) {
  try {
    let data = await get(URLs.GET_BLOG(id), {
      tags: [ENUMs.TAGS.BLOG],
    });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function getAllBlogs() {
  try {
    let data = await get(URLs.GET_ALL_BLOGS, { tags: [ENUMs.TAGS.BLOGS] });
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function createNewBlog() {
  try {
    let data = await post(URLs.CREATE_NEW_BLOG);
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.BLOGS);
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}

export async function generateBlog(form: {
  title: string;
  description: string;
}) {
  try {
    let data = await post(URLs.GENERATE_BLOG, form);
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.BLOGS);
    }
    if ((data as any).__isError) {
      throw data;
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}
export async function deleteBlog(id: string) {
  try {
    let data = await del(URLs.DELETE_BLOG, id);
    if (data && !(data as any).__isError) {
      revalidatePath(ENUMs.TAGS.BLOGS);
      revalidatePath(ENUMs.TAGS.BLOG);
    }
    return data;
  } catch (error) {
    return handleServerError(error);
  }
}
