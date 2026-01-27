"use server";
// TODO: Replace with Auth0 authentication
// import { auth } from "@clerk/nextjs/server";
import { TAGs } from "../enums";
import { isFileForm, buildFormData } from "../functions";
import { getLocale } from "next-intl/server";

const baseURL = process.env.NEXT_PUBLIC_API || "/";
type FetchOptions = {
  tags?: TAGs[];
  revalidate?: number | false;
  headers?: Record<string, string>;
};

const getHeaders = async (options?: FetchOptions, isFormData?: boolean) => {
  const locale = await getLocale();
  // TODO: Replace with Auth0 session retrieval
  // const { userId } = await auth();
  const headers: Record<string, string> = {
    "Content-Type": isFormData ? "" : "application/json",
    "x-locale": locale,
    ...options?.headers,
  };
  // TODO: Add Auth0 session token to headers
  // if (userId) {
  //   headers.Cookie = `session=${userId}`;
  // }
  return headers;
};

export async function get<T = any>(
  path: string,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const response = await fetch(`${baseURL}${path}`, {
    method: "GET",
    credentials: "include",
    headers: await getHeaders(options, false),
    next: options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));
    return {
      __isError: true,
      ...error,
      statusCode: error.statusCode || response.status,
    } as any;
  }

  return response.json();
}

export async function post<T = any>(
  path: string,
  data?: any,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const hasFiles = isFileForm(data);
  const formData = hasFiles ? buildFormData(data) : data;
  const isFormDataInstance = formData instanceof FormData;
  const response = await fetch(`${baseURL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: await getHeaders(options, isFormDataInstance),
    body: isFormDataInstance
      ? formData
      : formData
      ? JSON.stringify(formData)
      : undefined,
    next: options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));
    return {
      __isError: true,
      ...error,
      statusCode: error.statusCode || response.status,
    } as any;
  }

  return response.json();
}

export async function update<T = any>(
  path: string,
  data?: any,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const hasFiles = isFileForm(data);
  const formData = hasFiles ? buildFormData(data) : data;
  const isFormDataInstance = formData instanceof FormData;

  const response = await fetch(`${baseURL}${path}`, {
    method: "PUT",
    credentials: "include",
    headers: await getHeaders(options, isFormDataInstance),
    body: isFormDataInstance
      ? formData
      : formData
      ? JSON.stringify(formData)
      : undefined,
    next: options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));
    return {
      __isError: true,
      ...error,
      statusCode: error.statusCode || response.status,
    } as any;
  }

  return response.json();
}

export async function del<T = any>(
  path: string,
  id: string | number,
  options?: { tags?: TAGs[]; revalidate?: number | false }
): Promise<T> {
  const response = await fetch(`${baseURL}${path}/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: await getHeaders(options, false),
    next: options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
      statusCode: response.status,
    }));
    return {
      __isError: true,
      ...error,
      statusCode: error.statusCode || response.status,
    } as any;
  }

  return response.json();
}
