import { Box, Typography, ButtonBase } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 999,
      }}
    >
      <ButtonBase
        onClick={() => navigate("/")}
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: "999px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          px: 1.5,
          py: 1,
          width: "fit-content",
          transition: "background-color 0.3s ease-in-out",
          overflow: "hidden",

          "&:hover": {
            backgroundColor: "#f8f8f8",
          },
        }}
      >
        {/* Pokéball animée */}
        <Box
          component="img"
          src="/pokeball.png"
          alt="pokeball"
          sx={{
            width: 32,
            height: 32,
            transition: "transform 0.3s ease-in-out",
            animation: "none",
          }}
        />

        {/* Texte avec animation fluide */}
        <Typography
          className="back-text"
          variant="body2"
          sx={{
            ml: 1.5,
            fontWeight: "bold",
            color: "black",
            whiteSpace: "nowrap",
            opacity: 0,
            maxWidth: 0,
            overflow: "hidden",
            transition: "all 0.3s ease-in-out",

            ".MuiButtonBase-root:hover &": {
              opacity: 1,
              maxWidth: "200px",
            },
          }}
        >
          Go back to home
        </Typography>
      </ButtonBase>
    </Box>
  );
}
