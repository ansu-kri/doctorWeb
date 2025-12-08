import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const BASE_URL = 'http://localhost:3000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
//   tagTypes: ['Item', 'Invoice'],
  tagTypes: [],
  endpoints: () => ({}),
});

export default api;
