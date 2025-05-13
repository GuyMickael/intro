/* eslint-disable @typescript-eslint/no-explicit-any */
type IPokemonType = {
  name: string;
  image: string;
};

type ISpriteUrls = {
  regular: string;
  shiny: string | null;
  gmax: string | null;
};

type ILocalizedName = {
  fr: string;
  en: string;
  jp: string;
};

export type IPokemonData = {
  pokedex_id: number;
  generation: number;
  category: string;
  name: ILocalizedName;
  sprites: ISpriteUrls;
  types: IPokemonType[] | null;
  talents: any; // À préciser selon la structure réelle
  stats: {
    atk: number;
    def: number;
    hp: number;
    spe_atk: number;
    spe_def: number;
    vit: number;
  }; // À préciser selon la structure réelle
  resistances: any; // À préciser selon la structure réelle
  evolution: any; // À préciser selon la structure réelle
  height: number | null;
  weight: number | null;
  egg_groups: any; // À préciser selon la structure réelle
  sexe: any; // À préciser selon la structure réelle
  catch_rate: number | null;
  level_100: any; // À préciser selon la structure réelle
  formes: any; // À préciser selon la structure réelle
};

export type PokemonResponse = IPokemonData[];
