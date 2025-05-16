import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  addCapturedPokemon,
  removeCapturedPokemon,
} from "../../../store/slices/pokemon-slice";
import { useGetPokemonQuery } from "../../../api/pokemonApi";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";

export default function PokemonDetailedView() {
  
  /* -------------------- routing + RTK Query -------------------- */
  const { pokeId } = useParams<{ pokeId: string }>();
  const id = Number(pokeId);
  const navigate = useNavigate();

  /** Pokémon courant */
  const { data: pokemon, isLoading, isError } = useGetPokemonQuery(id);

  /** Sprites voisins (cache partagé) */
  const { data: prev } = useGetPokemonQuery(id - 1, { skip: id <= 1 });
  const { data: next } = useGetPokemonQuery(id + 1);

  /* -------------------- Redux : capture -------------------- */
  const dispatch = useAppDispatch();
  const capturedIds = useAppSelector((s) => s.pokemon.capturedPokemonIds);
  const isCaptured = capturedIds.includes(id);
  const toggleCapture = () =>
    dispatch(isCaptured ? removeCapturedPokemon(id) : addCapturedPokemon(id));

  /* -------------------- UI state -------------------- */
  const [spriteMode, setSpriteMode] = useState<"normal" | "shiny">("normal");
  const handleSpriteToggle = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "normal" | "shiny" | null
  ) => newMode && setSpriteMode(newMode);

  /* -------------------- Loading / Error -------------------- */
  if (isLoading)
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  if (isError || !pokemon)
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="error">Impossible de charger le Pokémon.</Typography>
      </Box>
    );

  /* -------------------- Render -------------------- */
  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        bgcolor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={4}
        gap={4}
        width={{ xs: "90%", md: "50%" }}
        bgcolor="white"
        borderRadius={3}
        boxShadow={4}
      >
        {/* IMAGE + TOGGLE + BADGE */}
        <Box position="relative" display="flex" alignItems="center">
          {isCaptured && (
            <Tooltip title="Pokémon capturé !">
              <Avatar
                src="/assets/pokeball.png"
                sx={{
                  position: "absolute",
                  top: -10,
                  left: -10,
                  width: 32,
                  height: 32,
                  bgcolor: "#fff",
                }}
              />
            </Tooltip>
          )}

          <img
            src={
              spriteMode === "normal"
                ? pokemon.sprites.regular ?? ""
                : pokemon.sprites.shiny ?? ""
            }
            alt={pokemon.name.fr}
            style={{ width: 200, height: 200, objectFit: "contain" }}
          />

          <ToggleButtonGroup
            value={spriteMode}
            exclusive
            orientation="vertical"
            size="small"
            onChange={handleSpriteToggle}
            sx={{ ml: 2 }}
          >
            <ToggleButton value="normal">🎨 Normal</ToggleButton>
            <ToggleButton value="shiny">⭐ Shiny</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* BOUTON CAPTURE */}
        <Button
          variant={isCaptured ? "outlined" : "contained"}
          color={isCaptured ? "warning" : "success"}
          onClick={toggleCapture}
          sx={{ gap: 1, fontWeight: "bold", textTransform: "none" }}
        >
          <Avatar
            src={
              isCaptured
                ? "https://media.tenor.com/Qf0w-d4L0MAAAAAe/pikachu-sad-pikachu.png"
                : "/pokeball.png"
            }
            sx={{ width: 24, height: 24 }}
          />
          {isCaptured ? "Relâcher" : "Capturer"}
        </Button>

        {/* INFOS */}
        <Card sx={{ minWidth: 300, maxWidth: 500, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {pokemon.name.fr}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
              gutterBottom
            >
              #{pokemon.pokedex_id} {pokemon.category}
            </Typography>

            <Typography variant="subtitle1" mt={2}>
              🧬 Types :
            </Typography>
            {pokemon.types?.map((t) => (
              <Box
                key={t.name}
                display="inline-flex"
                alignItems="center"
                gap={1}
                mr={1}
              >
                <img src={t.image} alt={t.name} width={20} height={20} />
                {t.name}
              </Box>
            ))}

            <Typography variant="subtitle1" mt={2}>
              📊 Stats :
            </Typography>
            {Object.entries(pokemon.stats).map(([k, v]) => (
              <Box key={k} display="flex" justifyContent="space-between">
                <Typography variant="body2">{k.toUpperCase()}</Typography>
                <Box flexGrow={1} borderBottom="1px solid #ccc" mx={2} />
                <Typography variant="body2">{v}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* NAVIGATION +/- 1 */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          gap={4}
          mt={2}
        >
          {prev?.sprites.regular && (
            <Button
              variant="outlined"
              disabled={id <= 1}
              onClick={() => navigate(`/pokemon/${id - 1}`)}
              sx={{ borderRadius: "50%", p: 2, minWidth: "auto" }}
            >
              <Avatar
                src={prev.sprites.regular}
                sx={{ width: 56, height: 56 }}
              />
              ⬅
            </Button>
          )}

          {next?.sprites.regular && (
            <Button
              variant="outlined"
              onClick={() => navigate(`/pokemon/${id + 1}`)}
              sx={{ borderRadius: "50%", p: 2, minWidth: "auto" }}
            >
              <Avatar
                src={next.sprites.regular}
                sx={{ width: 56, height: 56 }}
              />
              ➡
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
