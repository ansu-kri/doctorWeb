import api from "../api.jsx";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (formData) => ({ url: "/api/signup", method: "POST", body: formData }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({ url: "/api/login", method: "POST", body: { email, password } }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({ url: "/api/logout", method: "POST" }),
    }),
    getMe: builder.query({
      query: () => "/api/me",
      providesTags: ["Auth"],
    }),
    updateMe: builder.mutation({
      query: (body) => ({ url: "/api/me", method: "PATCH", body }),
      invalidatesTags: ["Auth"],
    }),
    getAlldoctors: builder.query({
      query: (params) => ({ url: "/api/doctors", params }),
      providesTags: ["Doctors"],
    }),
    getDoctor: builder.query({
      query: (id) => `/api/doctors/${id}`,
      providesTags: (result, error, id) => [{ type: "Doctors", id }],
    }),
    getAvailability: builder.query({
      query: ({ id, date }) => ({ url: `/api/doctors/${id}/availability`, params: { date } }),
    }),
    addReview: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/doctors/${id}/reviews`, method: "POST", body }),
      invalidatesTags: ["Doctors"],
    }),
    getSpecialties: builder.query({
      query: () => "/api/specialties",
      providesTags: ["Catalog"],
    }),
    getServices: builder.query({
      query: () => "/api/services",
      providesTags: ["Catalog"],
    }),
    getPublicStats: builder.query({
      query: () => "/api/public-stats",
    }),
    sendContact: builder.mutation({
      query: (body) => ({ url: "/api/contact", method: "POST", body }),
    }),
    getAppointments: builder.query({
      query: () => "/api/appointments",
      providesTags: ["Appointments"],
    }),
    createAppointment: builder.mutation({
      query: (body) => ({ url: "/api/appointments", method: "POST", body }),
      invalidatesTags: ["Appointments", "Notifications"],
    }),
    updateAppointment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/appointments/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Appointments", "Notifications"],
    }),
    getNotifications: builder.query({
      query: () => "/api/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationsRead: builder.mutation({
      query: () => ({ url: "/api/notifications/read", method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
    getAdminStats: builder.query({
      query: () => "/api/admin/stats",
      providesTags: ["Admin"],
    }),
    getAdminUsers: builder.query({
      query: (params) => ({ url: "/api/admin/users", params }),
      providesTags: ["Admin"],
    }),
    createAdminUser: builder.mutation({
      query: (body) => ({ url: "/api/admin/users", method: "POST", body }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    updateAdminUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/admin/users/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    deleteAdminUser: builder.mutation({
      query: (id) => ({ url: `/api/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    getAdminAppointments: builder.query({
      query: (params) => ({ url: "/api/admin/appointments", params }),
      providesTags: ["Admin", "Appointments"],
    }),
    updateAdminAppointment: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/api/admin/appointments/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Admin", "Appointments"],
    }),
    getAdminSpecialties: builder.query({
      query: () => "/api/admin/specialties",
      providesTags: ["Catalog"],
    }),
    saveAdminSpecialty: builder.mutation({
      query: ({ id, ...body }) => ({
        url: id ? `/api/admin/specialties/${id}` : "/api/admin/specialties",
        method: id ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: ["Catalog"],
    }),
    deleteAdminSpecialty: builder.mutation({
      query: (id) => ({ url: `/api/admin/specialties/${id}`, method: "DELETE" }),
      invalidatesTags: ["Catalog"],
    }),
    getAdminServices: builder.query({
      query: () => "/api/admin/services",
      providesTags: ["Catalog"],
    }),
    saveAdminService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: id ? `/api/admin/services/${id}` : "/api/admin/services",
        method: id ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: ["Catalog"],
    }),
    deleteAdminService: builder.mutation({
      query: (id) => ({ url: `/api/admin/services/${id}`, method: "DELETE" }),
      invalidatesTags: ["Catalog"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useGetAlldoctorsQuery,
  useGetDoctorQuery,
  useGetAvailabilityQuery,
  useAddReviewMutation,
  useGetSpecialtiesQuery,
  useGetServicesQuery,
  useGetPublicStatsQuery,
  useSendContactMutation,
  useGetAppointmentsQuery,
  useCreateAppointmentMutation,
  useUpdateAppointmentMutation,
  useGetNotificationsQuery,
  useMarkNotificationsReadMutation,
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useCreateAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useGetAdminAppointmentsQuery,
  useUpdateAdminAppointmentMutation,
  useGetAdminSpecialtiesQuery,
  useSaveAdminSpecialtyMutation,
  useDeleteAdminSpecialtyMutation,
  useGetAdminServicesQuery,
  useSaveAdminServiceMutation,
  useDeleteAdminServiceMutation,
} = authApi;
