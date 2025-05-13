import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Fab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IPokemonData } from "../../../types/pokedexApi.types";

export function PokemonList() {
  const [pokemons, setPokemons] = useState<IPokemonData[]>([]);
  const [page, setPage] = useState(0);
  const itemsPerPage = 35;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://tyradex.app/api/v1/gen/1")
      .then((res) => res.json())
      .then((data) => setPokemons(data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des données", error)
      );
  }, []);

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPokemons = pokemons.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (endIndex < pokemons.length) setPage(page + 1);
  };

  return (
    <Box p={2} position="relative">
      <Grid container spacing={2}>
        {currentPokemons.map((poke) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Card
              sx={{
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/pokemon/${poke.pokedex_id}`)}
              >
                <CardMedia
                  component="img"
                  image={poke.sprites?.regular}
                  alt={poke.name.fr}
                  sx={{
                    width: "85%",
                    height: 100,
                    objectFit: "contain",
                    p: 1,
                  }}
                />
                <CardContent sx={{ textAlign: "center", p: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    {poke.name.fr}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Boutons flottants */}
      <Box
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: "flex",
          gap: 1,
          zIndex: 1000,
        }}
      >
        <Fab
          size="small"
          color="primary"
          onClick={handlePrevious}
          disabled={page === 0}
        >
          <ArrowBackIcon />
        </Fab>
        <Fab
          size="small"
          color="primary"
          onClick={handleNext}
          disabled={endIndex >= pokemons.length}
        >
          <ArrowForwardIcon />
        </Fab>
      </Box>
    </Box>
  );
}
