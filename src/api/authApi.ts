import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000", // ← ton serveur Express
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("jwt_token");
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    /** POST /login → { token: "jwt..." } */
    login: builder.mutation<
      { token: string },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),

      /* Dès que la requête réussit, on stocke le JWT */
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // ← { token }
          localStorage.setItem("jwt_token", data.token);
        } catch {
          /* ignore ou gestion d’erreur */
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
