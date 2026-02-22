import api from '../api.jsx';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    // ================= SIGNUP =================
    signup: builder.mutation({
      query: (formData) => ({
        url: '/signup',
        method: 'POST',
        body: formData,   // IMPORTANT: send FormData (for profilePic)
      }),
    }),

    // ================= LOGIN =================
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: '/login',
        method: 'POST',
        body: { email, password },
      }),
    }),

    // ================= LOGOUT =================
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    //===============getAlldoctors============

    getAlldoctors: builder.query({
      query: () => ({
        url: '/doctors',
        method: 'GET',
      })
    })

  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetAlldoctorsQuery,
} = authApi;