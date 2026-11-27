const API_URL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? "http://localhost:5000" : "");

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const allowedImageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export const validateImageFile = (file: File): string | null => {
  if (!allowedImageTypes.has(file.type)) {
    return "Choose a JPEG, PNG, GIF, or WebP image.";
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image must be 2 MB or smaller.";
  }
  return null;
};

export const uploadFormDataWithProgress = <T,>(
  path: string,
  formData: FormData,
  onProgress: (percentage: number) => void,
  method: "POST" | "PATCH" = "POST",
): Promise<T> =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(method, `${API_URL}${path}`);
    const token = localStorage.getItem("token");
    if (token) request.setRequestHeader("authorization", `Bearer ${token}`);

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    });
    request.addEventListener("load", () => {
      let response: { message?: string } & Record<string, unknown> = {};
      try {
        response = JSON.parse(request.responseText);
      } catch {
        reject(new Error("The server returned an invalid upload response."));
        return;
      }
      if (request.status >= 200 && request.status < 300) {
        resolve(response as T);
        return;
      }
      reject(new Error(response.message || "Image upload failed."));
    });
    request.addEventListener("error", () =>
      reject(new Error("Network error while uploading the image.")),
    );
    request.addEventListener("abort", () =>
      reject(new Error("Image upload was cancelled.")),
    );
    request.send(formData);
  });
