import api from '../../app/api.jsx';

export const invoiceApi = api.injectEndpoints({
  endpoints: builder => ({
    getInvoice: builder.query({
      query: () => '/invoices',
      transformResponse: (response) => response.data,
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: ({ customerName, items, received = 0 }) => ({
        url: '/createInvoice',
        method: 'POST',
        body: {
          customerName,
          items: items.map(({ _id, qty }) => ({
            _id,
            qty: Number(qty),
          })),
          received: Number(received),
        },
      }),
      invalidatesTags: ['Invoice'],
    }),
  }),
});

export const { useGetInvoiceQuery, useCreateInvoiceMutation } = invoiceApi;
