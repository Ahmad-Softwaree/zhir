export type SerializableError = {
  __isError?: boolean;
  statusCode: number;
  message: string;
  errorCode?: string;
  details?: string[];
  fields?: Array<{ field: string; messages: string[] }>;
};

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;
  details?: string[];
  fields?: Array<{ field: string; messages: string[] }>;

  constructor(data: SerializableError) {
    super(data.message);
    this.name = "ApiError";
    this.statusCode = data.statusCode;
    this.errorCode = data.errorCode;
    this.details = data.details;
    this.fields = data.fields;
  }
}

/**
 * Checks if a Server Action response is an error object and throws it as ApiError
 * This is necessary because Server Actions can't throw Error instances - they must return plain objects
 */
export function throwIfError<T>(data: T): T {
  if (data && typeof data === "object" && (data as any).__isError) {
    throw new ApiError(data as any);
  }
  return data;
}

export function handleServerError(error: unknown): SerializableError {
  console.error("handleServerError received:", error);

  if (typeof error === "object" && error !== null) {
    const anyErr = error as any;

    const statusCode = anyErr.statusCode ?? 500;
    const errorCode = anyErr.errorCode;
    const message = anyErr.message;

    // --- Case 1: Validation errors (422) ---
    if (
      statusCode === 422 &&
      Array.isArray(message) &&
      message.length > 0 &&
      typeof message[0] === "object" &&
      "field" in message[0]
    ) {
      const validationErrors = message as Array<{
        field: string;
        messages: string[];
      }>;

      const allMessages = validationErrors.flatMap((e) => e.messages);

      return {
        __isError: true,
        statusCode,
        message: allMessages[0] || "errors.validationFailed",
        details: allMessages,
        fields: validationErrors,
      } as any;
    }

    // --- Case 2: message is array ---
    if (Array.isArray(message)) {
      return {
        __isError: true,
        statusCode,
        message: message[0],
        details: message,
      } as any;
    }

    // --- Case 3: message is string ---
    if (typeof message === "string") {
      return {
        __isError: true,
        statusCode,
        message,
        errorCode,
      } as any;
    }

    // --- Unknown shape ---
    return {
      __isError: true,
      statusCode,
      message: "errors.unknownServerShape",
    } as any;
  }

  return {
    __isError: true,
    statusCode: 500,
    message: "errors.unknownError",
  } as any;
}

export function handleMutationError(
  error: any,
  t: any,
  fallbackKey: string,
  onError: (message: string) => void,
  options?: {
    showAllErrors?: boolean;
    includeFieldNames?: boolean;
  }
): void {
  // --- Validation errors ---
  if (error.fields?.length) {
    const showAll = options?.showAllErrors ?? true;
    const includeField = options?.includeFieldNames ?? false;

    const fields = showAll ? error.fields : [error.fields[0]];

    fields.forEach((f: { field: string; messages: string[] }) => {
      f.messages.forEach((msg) => {
        let havMsg = t.has(msg);
        let translated = t(msg) || msg;
        if (!havMsg) {
          translated = msg;
        }
        onError(includeField ? `${f.field}: ${translated}` : translated);
      });
    });
    return;
  }

  // --- Multiple messages ---
  if (error.details?.length) {
    error.details.forEach((msg: string) => onError(t(msg) || msg));
    return;
  }

  // --- Single message ---
  let havMsg = t.has(error.message);
  let translated = havMsg ? t(error.message) : error.message;
  onError(translated);
}
