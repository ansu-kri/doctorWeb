import api from "../api";

export interface ApiError {
  data?: { message?: string };
  status?: number;
}

export interface PaginationParams extends Record<
  string,
  string | number | undefined
> {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Doctor {
  _id: string;
  fullName: string;
  specialization?: string;
  averageRating?: number | string;
  totalRating?: number;
  hospital?: string;
  location?: string;
  ticketPrice?: number | string;
  profilePic?: string;
  bio?: string;
  qualifications?: string[];
  experiences?: string[];
  timeSlots?: Array<{ day: string; startTime: string; endTime: string }>;
  reviews?: Array<{
    _id: string;
    user?: { fullName: string };
    rating: number;
    comment: string;
  }>;
}

export interface Specialty {
  _id: string;
  name: string;
  description?: string;
  isActive?: boolean;
  icon?: string;
}

export interface Service {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  isActive?: boolean;
  icon?: string;
}

export interface Appointment {
  _id: string;
  doctor?: { fullName: string };
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  status: string;
  ticketPrice: number | string;
  patientName?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    profilePic?: string;
    gender?: string;
  };
  notes?: string;
  rejectionReason?: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface User {
  [key: string]: unknown;
  _id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  phone?: string;
  profilePic?: string;
  profilePicPublicId?: string;
  bloodType?: string;
  gender?: string;
  photo?: string;
  password?: string;
  specialization?: string;
  hospital?: string;
  location?: string;
  ticketPrice?: number | string;
  qualifications?: string[];
  experiences?: string[];
  isAvailable?: boolean;
  isActive?: boolean;
}

interface AdminUserMutationResponse {
  success: boolean;
  data?: User;
  warning?: string;
}

export interface Stats {
  patients?: number;
  doctors?: number;
  appointments?: number;
  satisfaction?: number;
  years?: number;
  trend?: Array<{ _id: string; count: number }>;
  status?: Record<string, number>;
  recentAppointments?: Appointment[];
  recentUsers?: User[];
}

export interface AuthResponse {
  token?: string;
  role?: string;
  [key: string]: unknown;
  message?: string;
}

export interface DoctorStats {
  totalPatients: number;
  todaysAppointments: number;
  upcomingAppointments: number;
  pendingRequests: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todaysAppointmentsList: Appointment[];
}

export interface DoctorAvailability {
  timeSlots: Array<{ day: string; startTime: string; endTime: string }>;
  isAvailable: boolean;
  isApproved: string;
}

export interface DoctorPatient {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  profilePic?: string;
  gender?: string;
  totalAppointments: number;
  statuses: string[];
  lastAppointment: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  phone: string;
  [key: string]: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone: string;
  bloodType: string;
  gender: string;
}

export interface UpdateProfileResponse {
  success?: boolean;
  message?: string;
  data: User;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, FormData>({
      query: (formData) => ({
        url: "/api/signup",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: ({ email, password }) => ({
        url: "/api/login",
        method: "POST",
        body: { email, password },
      }),
      invalidatesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/api/logout", method: "POST" }),
    }),
    getMe: builder.query<{ data: User }, void>({
      query: () => "/api/me",
      providesTags: ["Auth"],
    }),
    updateMe: builder.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (body) => ({
        url: "/api/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    deleteMeProfileImage: builder.mutation<
      { success: boolean; data: User; warning?: string },
      void
    >({
      query: () => ({ url: "/api/me/profile-image", method: "DELETE" }),
      invalidatesTags: ["Auth"],
    }),
    getAlldoctors: builder.query<{ data: Doctor[] }, PaginationParams | void>({
      query: (params) => ({
        url: "/api/doctors",
        params: params as
          | Record<string, string | number | undefined>
          | undefined,
      }),
      providesTags: ["Doctors"],
    }),
    getDoctor: builder.query<{ data: Doctor }, string>({
      query: (id) => `/api/doctors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Doctors", id }],
    }),
    getAvailability: builder.query<
      { data: string[] },
      { id: string; date: string }
    >({
      query: ({ id, date }) => ({
        url: `/api/doctors/${id}/availability`,
        params: { date },
      }),
    }),
    getDoctorStats: builder.query<{ data: DoctorStats }, void>({
      query: () => "/api/doctor/stats",
      providesTags: ["Appointments"],
    }),
    getDoctorAppointments: builder.query<
      { data: Appointment[]; pagination: PaginationInfo },
      PaginationParams | void
    >({
      query: (params) => ({
        url: "/api/doctor/appointments",
        params: params as Record<string, string | number | undefined> | undefined,
      }),
      providesTags: ["Appointments"],
    }),
    getDoctorPatients: builder.query<
      { data: DoctorPatient[]; pagination: PaginationInfo },
      PaginationParams | void
    >({
      query: (params) => ({
        url: "/api/doctor/patients",
        params: params as Record<string, string | number | undefined> | undefined,
      }),
      providesTags: ["Appointments"],
    }),
    getDoctorAvailability: builder.query<{ data: DoctorAvailability }, void>({
      query: () => "/api/doctor/availability",
      providesTags: ["Auth"],
    }),
    updateDoctorAvailability: builder.mutation<
      { data: DoctorAvailability },
      Partial<DoctorAvailability>
    >({
      query: (body) => ({
        url: "/api/doctor/availability",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateDoctorProfile: builder.mutation<
      UpdateProfileResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/api/doctor/profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
    addReview: builder.mutation<
      void,
      { id: string; rating: number; comment: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/doctors/${id}/reviews`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Doctors"],
    }),
    getSpecialties: builder.query<{ data: Specialty[] }, void>({
      query: () => "/api/specialties",
      providesTags: ["Catalog"],
    }),
    getServices: builder.query<{ data: Service[] }, void>({
      query: () => "/api/services",
      providesTags: ["Catalog"],
    }),
    getPublicStats: builder.query<{ data: Stats }, void>({
      query: () => "/api/public-stats",
    }),
    sendContact: builder.mutation<void, ContactForm>({
      query: (body) => ({ url: "/api/contact", method: "POST", body }),
    }),
    getAppointments: builder.query<{ data: Appointment[] }, void>({
      query: () => "/api/appointments",
      providesTags: ["Appointments"],
    }),
    createAppointment: builder.mutation<
      { data: Appointment },
      Record<string, unknown>
    >({
      query: (body) => ({ url: "/api/appointments", method: "POST", body }),
      invalidatesTags: ["Appointments", "Notifications"],
    }),
    updateAppointment: builder.mutation<
      void,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/appointments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Appointments", "Notifications"],
    }),
    getNotifications: builder.query<{ data: Notification[] }, void>({
      query: () => "/api/notifications",
      providesTags: ["Notifications"],
    }),
    markNotificationsRead: builder.mutation<void, void>({
      query: () => ({ url: "/api/notifications/read", method: "PATCH" }),
      invalidatesTags: ["Notifications"],
    }),
    getAdminStats: builder.query<{ data: Stats }, void>({
      query: () => "/api/admin/stats",
      providesTags: ["Admin"],
    }),
    getAdminUsers: builder.query<{ data: User[]; pagination: PaginationInfo }, PaginationParams | void>({
      query: (params) => ({
        url: "/api/admin/users",
        params: params as
          | Record<string, string | number | undefined>
          | undefined,
      }),
      providesTags: ["Admin"],
    }),
    createAdminUser: builder.mutation<AdminUserMutationResponse, Partial<User>>({
      query: (body) => ({ url: "/api/admin/users", method: "POST", body }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    updateAdminUser: builder.mutation<
      AdminUserMutationResponse,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/users/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    deleteAdminUser: builder.mutation<AdminUserMutationResponse, string>({
      query: (id) => ({ url: `/api/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Admin", "Doctors"],
    }),
    getAdminAppointments: builder.query<
      { data: Appointment[]; pagination: PaginationInfo },
      PaginationParams | void
    >({
      query: (params) => ({
        url: "/api/admin/appointments",
        params: params as
          | Record<string, string | number | undefined>
          | undefined,
      }),
      providesTags: ["Admin", "Appointments"],
    }),
    updateAdminAppointment: builder.mutation<
      void,
      { id: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({
        url: `/api/admin/appointments/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Admin", "Appointments"],
    }),
    getAdminSpecialties: builder.query<{ data: Specialty[] }, void>({
      query: () => "/api/admin/specialties",
      providesTags: ["Catalog"],
    }),
    saveAdminSpecialty: builder.mutation<
      void,
      { id?: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({
        url: id ? `/api/admin/specialties/${id}` : "/api/admin/specialties",
        method: id ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: ["Catalog"],
    }),
    deleteAdminSpecialty: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/admin/specialties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Catalog"],
    }),
    getAdminServices: builder.query<{ data: Service[] }, void>({
      query: () => "/api/admin/services",
      providesTags: ["Catalog"],
    }),
    saveAdminService: builder.mutation<
      void,
      { id?: string; [key: string]: unknown }
    >({
      query: ({ id, ...body }) => ({
        url: id ? `/api/admin/services/${id}` : "/api/admin/services",
        method: id ? "PATCH" : "POST",
        body,
      }),
      invalidatesTags: ["Catalog"],
    }),
    deleteAdminService: builder.mutation<void, string>({
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
  useDeleteMeProfileImageMutation,
  useGetAlldoctorsQuery,
  useGetDoctorQuery,
  useGetAvailabilityQuery,
  useAddReviewMutation,
  useGetDoctorStatsQuery,
  useGetDoctorAppointmentsQuery,
  useGetDoctorPatientsQuery,
  useGetDoctorAvailabilityQuery,
  useUpdateDoctorAvailabilityMutation,
  useUpdateDoctorProfileMutation,
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
