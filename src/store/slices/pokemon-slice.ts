import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PokemonCapturedState {
  capturedPokemonIds: number[];
}

const initialState: PokemonCapturedState = {
  capturedPokemonIds: [],
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    // Pas besoin de return dans les reducers (On peut faire des "mutations" grâce à 'immer')
    addCapturedPokemon: (state, action: PayloadAction<number>) => {
      state.capturedPokemonIds.push(action.payload);
    },
    removeCapturedPokemon: (state, action: PayloadAction<number>) => {
      state.capturedPokemonIds = state.capturedPokemonIds.filter(
        (id) => id !== action.payload
      );
    },
  },
});
export const { addCapturedPokemon, removeCapturedPokemon } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
