import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = 'http://localhost:5000/api';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token"); // or AsyncStorage in RN

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: [],
  endpoints: () => ({}),
});

export default api;