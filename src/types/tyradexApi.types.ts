/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PokemonTypeName {
  fr: string;
  en: string;
  jp: string;
}

export interface TypeResistance {
  name: string;
  multiplier: number;
}

export interface PokemonType {
  id: number;
  name: PokemonTypeName;
  sprites: string;
  resistances: TypeResistance[];
}
