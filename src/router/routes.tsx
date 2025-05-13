import { RouteObject } from "react-router-dom";
import PokemonDetailedView from "../components/pokedex/PokemonDetailedView/PokemonDetailedView";
import NotFound from "../components/404/NotFound";
import RootLayout from "./RootLayout";
import { PokemonList } from "../components/pokedex/PokemonList/PokemonList";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <PokemonList />,
      },
      {
        path: "pokemon/:pokeId",
        element: <PokemonDetailedView />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default myRoutes;
