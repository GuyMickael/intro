import { RouteObject } from "react-router-dom";
import PokemonDetailedView from "../components/pokedex/PokemonDetailedView/PokemonDetailedView";
import NotFound from "../components/404/NotFound";
import RootLayout from "./RootLayout";
import { PokemonList } from "../components/pokedex/PokemonList/PokemonList";
import { GenerationSelector } from "../components/pokedex/GenerationSelector/GenerationSelector";
import LoginForm from "../components/LoginForm/LoginForm";
import { FlowTester } from "../components/TestFlow";

const myRoutes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <GenerationSelector />,
      },
      {
        path: "generations",
        element: <GenerationSelector />,
      },
      {
        path: "generation/:generationId",
        element: <PokemonList />,
      },
      {
        path: "pokemons",
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
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/flow",
        element: <FlowTester />,
      },
    ],
  },
];

export default myRoutes;
