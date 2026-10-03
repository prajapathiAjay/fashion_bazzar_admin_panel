import { baseApi } from "./baseApi";

export const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // POST /upload  (form-data: files[], folder)
    // Returns: [{ url, publicId }, ...]
    uploadFiles: build.mutation({
      query: ({ files, folder }) => {
        const formData = new FormData();
        [].concat(files).forEach((file) => formData.append("files", file));
        if (folder) formData.append("folder", folder);
        return { url: "/upload", method: "POST", body: formData };
      },
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useUploadFilesMutation } = uploadApi;
