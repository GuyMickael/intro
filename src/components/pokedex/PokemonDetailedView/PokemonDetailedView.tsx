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
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IPokemonData } from "../../../types/pokedexApi.types";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import {
  addCapturedPokemon,
  removeCapturedPokemon,
} from "../../../store/slices/pokemon-slice";

export default function PokemonDetailedView() {
  const { pokeId } = useParams<{ pokeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // --- State local pour la vue ---
  const [pokemon, setPokemon] = useState<IPokemonData | null>(null);
  const [spriteMode, setSpriteMode] = useState<"normal" | "shiny">("normal");
  const [loading, setLoading] = useState(true);
  const [prevSprite, setPrevSprite] = useState<string | null>(null);
  const [nextSprite, setNextSprite] = useState<string | null>(null);

  // --- Sélecteur Redux : ids capturés ---
  const capturedIds = useAppSelector(
    (state) => state.pokemon.capturedPokemonIds
  );

  const isCaptured = pokemon ? capturedIds.includes(pokemon.pokedex_id) : false;

  // --- Effet principal : récupérer le Pokémon et les sprites voisins ---
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

  // --- Handlers ---
  const handleSpriteToggle = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "normal" | "shiny" | null
  ) => {
    if (newMode) setSpriteMode(newMode);
  };

  const goTo = (offset: number) => {
    const id = Number(pokeId);
    if (!isNaN(id)) navigate(`/pokemon/${id + offset}`);
  };

  const handleCaptureToggle = () => {
    if (pokemon) {
      dispatch(
        isCaptured
          ? removeCapturedPokemon(pokemon.pokedex_id)
          : addCapturedPokemon(pokemon.pokedex_id)
      );
    }
  };

  // --- UI : Loading ---
  if (loading || !pokemon || !pokemon.sprites) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

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
        boxShadow={4}
      >
        {/* IMAGE + TOGGLE + BADGE DE CAPTURE */}
        <Box
          position="relative"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          {/* Badge Pokéball pour statut capturé */}
          {isCaptured && (
            <Tooltip title="Pokémon capturé !">
              <Avatar
                src="/assets/pokeball.png" // place une petite icône de Pokéball dans /public/assets
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
                ? pokemon.sprites.regular ?? undefined
                : pokemon.sprites.shiny ?? undefined
            }
            alt={pokemon.name.fr}
            style={{ width: "200px", height: "200px", objectFit: "contain" }}
          />
          <Box ml={2}>
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

        {/* BOUTON CAPTURE / RELACHER */}
        <Button
          onClick={handleCaptureToggle}
          variant={isCaptured ? "outlined" : "contained"}
          color={isCaptured ? "warning" : "success"}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: "bold",
            textTransform: "none",
          }}
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
              🧬 Types:
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
              sx={{ borderRadius: "50%", p: 2, minWidth: "auto" }}
              disabled={pokemon.pokedex_id === 1}
            >
              <Avatar src={prevSprite} sx={{ width: 56, height: 56, mb: 1 }} />⬅
            </Button>
          )}

          {nextSprite && (
            <Button
              onClick={() => goTo(1)}
              variant="outlined"
              sx={{ borderRadius: "50%", p: 2, minWidth: "auto" }}
            >
              <Avatar src={nextSprite} sx={{ width: 56, height: 56, mb: 1 }} />➡
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
}
