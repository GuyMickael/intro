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
      {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        refreshExpiresIn: number;
      },
      { username: string; password: string }
    >({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // stocker les deux tokens :
          localStorage.setItem("access_token", data.accessToken);
          localStorage.setItem("refresh_token", data.refreshToken);
          // facultatif : on peut aussi noter les expirations si besoin
          localStorage.setItem("access_expires_in", data.expiresIn.toString());
          localStorage.setItem(
            "refresh_expires_in",
            data.refreshExpiresIn.toString()
          );
        } catch {
          // gérer l’erreur si on veut
        }
      },
    }),

    /** POST /refresh → { accessToken: "...", expiresIn: 20 } */
    refresh: builder.mutation<{ accessToken: string; expiresIn: number }, void>(
      {
        query: () => {
          const refreshToken = localStorage.getItem("refresh_token");
          return {
            url: "/refresh",
            method: "POST",
            body: { refreshToken },
            headers: { "Content-Type": "application/json" },
          };
        },
        async onQueryStarted(_, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            // Remplacer l’ancien accessToken
            localStorage.setItem("access_token", data.accessToken);
            localStorage.setItem(
              "access_expires_in",
              data.expiresIn.toString()
            );
          } catch {
            // Si le refresh échoue (token invalide/expiré), on peut router vers la page de login
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        },
      }
    ),
  }),
});

export const { useLoginMutation, useRefreshMutation } = authApi;
