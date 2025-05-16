import { configureStore } from "@reduxjs/toolkit";

import pokemonReducer from "./slices/pokemon-slice";
import trainerReducer from "./slices/trainer-slice";
import { pokemonApi } from "../api/pokemonApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { authApi } from "../api/authApi";
export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    trainer: trainerReducer,
    [pokemonApi.reducerPath]: pokemonApi.reducer, // ← ① ajouter le reducer RTK Query
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware, authApi.middleware), // ← ② ajouter le middleware
});

// ③ active refetchOnFocus / OnReconnect si on les utilises
setupListeners(store.dispatch);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
