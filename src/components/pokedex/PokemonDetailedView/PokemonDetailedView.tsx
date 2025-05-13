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
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IPokemonData } from "../../../types/pokedexApi.types";

export default function PokemonDetailedView() {
  const { pokeId } = useParams<{ pokeId: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<IPokemonData | null>(null);
  const [spriteMode, setSpriteMode] = useState<"normal" | "shiny">("normal");
  const [loading, setLoading] = useState(true);

  const [prevSprite, setPrevSprite] = useState<string | null>(null);
  const [nextSprite, setNextSprite] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://tyradex.app/api/v1/pokemon/${pokeId}`);
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        console.error("Erreur API Tyradex :", err);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchPreviewSprites = async () => {
      const currentId = Number(pokeId);
      if (isNaN(currentId)) return;

      try {
        const [prevRes, nextRes] = await Promise.all([
          fetch(`https://tyradex.app/api/v1/pokemon/${currentId - 1}`),
          fetch(`https://tyradex.app/api/v1/pokemon/${currentId + 1}`),
        ]);

        const prevData = prevRes.ok ? await prevRes.json() : null;
        const nextData = nextRes.ok ? await nextRes.json() : null;

        setPrevSprite(prevData?.sprites?.regular ?? null);
        setNextSprite(nextData?.sprites?.regular ?? null);
      } catch {
        console.warn("Erreur lors de la récupération des sprites voisins");
        setPrevSprite(null);
        setNextSprite(null);
      }
    };

    fetchPokemon();
    fetchPreviewSprites();
  }, [pokeId]);

  const handleSpriteToggle = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "normal" | "shiny" | null
  ) => {
    if (newMode) setSpriteMode(newMode);
  };

  const goTo = (offset: number) => {
    const id = Number(pokeId);
    if (!isNaN(id)) {
      navigate(`/pokemon/${id + offset}`);
    }
  };

  if (loading || !pokemon || !pokemon.sprites) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  console.log("Pokemon data:", pokemon);
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
        width={"50%"}
        bgcolor={"white"}
        borderRadius={3}
      >
        {/* IMAGE + TOGGLE */}
        <Box display="flex" flexDirection="row" alignItems="center">
          <img
            src={
              spriteMode === "normal"
                ? pokemon.sprites.regular ?? undefined
                : pokemon.sprites.shiny ?? undefined
            }
            alt={pokemon.name.fr}
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
          <Box>
            <ToggleButtonGroup
              value={spriteMode}
              exclusive
              onChange={handleSpriteToggle}
              orientation="vertical"
              size="small"
            >
              <ToggleButton value="normal">🎨 Normal</ToggleButton>
              <ToggleButton value="shiny">⭐ Shiny</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* INFOS POKEMON */}
        <Card sx={{ minWidth: 300, maxWidth: 500, boxShadow: 6 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {pokemon.name.fr}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              gutterBottom
              sx={{ fontStyle: "italic", mt: 0 }}
            >
              #{pokemon.pokedex_id} {pokemon.category}
            </Typography>
            <Typography variant="subtitle1" mt={2}>
              🧬 Types:{" "}
            </Typography>
            {pokemon.types?.map((t) => (
              <Box
                key={t.name}
                display="inline-flex"
                alignItems="center"
                gap={1}
                mr={1}
              >
                <img
                  src={t.image}
                  alt={t.name}
                  style={{ width: "20px", height: "20px" }}
                />
                {t.name}
              </Box>
            ))}

            <Typography variant="subtitle1" mt={2}>
              📊 Stats :
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {Object.entries(pokemon.stats).map(([key, value]) => (
                <Box key={key} display="flex" justifyContent="space-between">
                  <Typography variant="body2">{key.toUpperCase()}</Typography>
                  <Box
                    flexGrow={1}
                    borderBottom="1px solid #ccc"
                    mx={2}
                    mb={1}
                  />
                  <Typography variant="body2">{value}</Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* BOUTONS DE NAVIGATION AVEC SPRITES */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          gap={4}
          mt={2}
        >
          {prevSprite && (
            <Button
              onClick={() => goTo(-1)}
              variant="outlined"
              sx={{
                borderRadius: "50%",
                padding: 2,
                minWidth: "auto",
              }}
              disabled={pokemon.pokedex_id === 1}
            >
              <Avatar
                src={prevSprite}
                sx={{
                  width: 56,
                  height: 56,
                  mb: 1,
                  transition: "transform 0.5s ease",
                  "&:hover": {
                    transform: "scale(1.4)",
                  },
                }}
              />
              ⬅
            </Button>
          )}

          {nextSprite && (
            <Button
              onClick={() => goTo(1)}
              variant="outlined"
              sx={{
                borderRadius: "50%",
                padding: 2,
                minWidth: "auto",
              }}
            >
              <Avatar
                src={nextSprite}
                sx={{
                  width: 56,
                  height: 56,
                  mb: 1,
                  transition: "transform 0.5s ease",
                  "&:hover": {
                    transform: "scale(1.4)",
                  },
                }}
              />
              ➡
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
