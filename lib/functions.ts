export const isFileForm = (form: any): boolean => {
  if (!form) return false;

  return Object.values(form).some((value) => {
    if (value instanceof File) return true;

    if (Array.isArray(value)) {
      return value.some((v) => v instanceof File);
    }

    return false;
  });
};

export const imageSrc = (image?: string) => {
  if (!image) {
    return "/images/placeholder.svg";
  } // Check if the image string starts with the Unsplash domain

  const isUnsplashUrl =
    image.startsWith("https://images.unsplash.com/") ||
    image.startsWith("https://unsplash.com/") ||
    image.startsWith("https://plus.unsplash.com/");

  if (isUnsplashUrl) {
    return image; // Return the Unsplash URL directly
  } else {
    // Assume it's a file path stored on your API server
    return `${process.env.NEXT_PUBLIC_API}${image}`;
  }
};
export const buildFormData = (form: any): FormData => {
  const formData = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    // Skip undefined and null values (especially for optional image field)
    if (value === undefined || value === null) {
      return;
    }

    // 1. MULTIPLE FILES (images[])
    if (Array.isArray(value) && value.every((v) => v instanceof File)) {
      value.forEach((file) => formData.append(key, file));
      return;
    }

    // 2. MIXED ARRAY: old images (string) + new ones (File)
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v instanceof File) {
          formData.append(key, v);
        } else if (v !== undefined && v !== null) {
          formData.append(key, v); // string (old image path)
        }
      });
      return;
    }

    // 3. SINGLE FILE
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // 4. OBJECT (normal fields)
    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    // 5. NUMBERS
    if (typeof value === "number") {
      formData.append(key, value.toString());
      return;
    }

    // 6. EVERYTHING ELSE (strings, booleans, etc)
    formData.append(key, String(value));
  });

  return formData;
};
