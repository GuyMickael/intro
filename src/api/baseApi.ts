/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fetchBaseQuery,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";
import { Mutex } from "async-mutex";

// ─────────────────────────────────────────────────────────────────────────────
// 1. Interface pour le payload du JWT (on a besoin juste de exp)
// ─────────────────────────────────────────────────────────────────────────────
interface JwtPayload {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number; // timestamp UNIX en secondes
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Petit utilitaire pour vérifier si le token est expiré
// ─────────────────────────────────────────────────────────────────────────────
function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<JwtPayload>(token);
    // exp est en secondes UNIX, Date.now() est en millisecondes :
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Un fetchBaseQuery “de base” qui ajoute l’Authorization si on a un access_token
// ─────────────────────────────────────────────────────────────────────────────
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. On crée un mutex pour éviter de lancer plusieurs refresh en même temps
// ─────────────────────────────────────────────────────────────────────────────
const mutex = new Mutex();

// ─────────────────────────────────────────────────────────────────────────────
// 5. “baseQueryWithReauth” englobe baseQuery pour gérer automatiquement le refresh
// ─────────────────────────────────────────────────────────────────────────────
const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: import("@reduxjs/toolkit/query").BaseQueryApi,
  extraOptions: unknown
) => {
  // 5.1. Si un autre refresh est déjà en cours, on attend la fin
  if (mutex.isLocked()) {
    await mutex.waitForUnlock();
  }

  // 5.2. On lit les tokens directement dans localStorage
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  // 5.3. Si l’accessToken est expiré (ou absent), on tente un refresh
  if (isTokenExpired(accessToken)) {
    // 5.3.1. Si on n’a pas de refreshToken → on supprime tout et on renvoie une erreur
    if (!refreshToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      return {
        error: {
          status: 401,
          data: { message: "No refresh token, please log in again." },
        } as FetchBaseQueryError,
      };
    }

    // 5.3.2. Si aucun refresh n’est déjà en cours, on le déclenche
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        // Appel à POST /refresh pour récupérer un nouveau accessToken
        const refreshResult = await baseQuery(
          {
            url: "/refresh",
            method: "POST",
            body: { refreshToken },
            headers: { "Content-Type": "application/json" },
          },
          api,
          extraOptions as object
        );

        if (refreshResult.data) {
          // 5.3.3. Si on obtient un nouveau accessToken, on le stocke
          const { accessToken: newAccessToken, expiresIn } =
            refreshResult.data as { accessToken: string; expiresIn: number };

          localStorage.setItem("access_token", newAccessToken);
          // (Optionnel) stocker l’expiration en ms si vous souhaitez le vérifier autrement :
          localStorage.setItem(
            "access_expires_at",
            (Date.now() + expiresIn * 1000).toString()
          );

          accessToken = newAccessToken;
        } else {
          // 5.3.4. Si /refresh renvoie une erreur (ex. token invalide), on supprime tout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return {
            error: {
              status: 403,
              data: { message: "Refresh token invalid or expired." },
            } as FetchBaseQueryError,
          };
        }
      } finally {
        release();
      }
    } else {
      // 5.3.5. Si un refresh est déjà en cours, on attend qu’il se termine
      await mutex.waitForUnlock();
      accessToken = localStorage.getItem("access_token");
    }
  }

  // 5.4. À présent, on est sûr d’avoir un accessToken (ou on a déjà renvoyé une erreur)
  // On exécute la requête initiale avec le token (baseQuery ajoutera l’en-tête grâce à prepareHeaders)
  const result = await baseQuery(args, api, extraOptions as object);

  // 5.5. Si l’API retourne encore un 401 (par exemple expiration survenue pendant la requête),
  // on essaie un ultime refresh, puis on relance la même requête une fois.
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // 5.5.1. Même logique : si un refresh est en cours, on attend, sinon on le déclenche
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await baseQuery(
          {
            url: "/refresh",
            method: "POST",
            body: { refreshToken },
            headers: { "Content-Type": "application/json" },
          },
          api,
          extraOptions as object
        );

        if (refreshResult.data) {
          const { accessToken: newAccessToken, expiresIn } =
            refreshResult.data as { accessToken: string; expiresIn: number };

          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem(
            "access_expires_at",
            (Date.now() + expiresIn * 1000).toString()
          );
          accessToken = newAccessToken;

          // Relancer la requête initiale avec le nouveau token
          return await baseQuery(args, api, extraOptions as object);
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          return result;
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      return await baseQuery(args, api, extraOptions as object);
    }
  }

  return result;
};

export default baseQueryWithReauth;
