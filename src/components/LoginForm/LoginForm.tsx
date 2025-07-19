import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPwd] = useState("");
  // on récupère le hook de login généré par RTK Query
  const [login, { isLoading, isError, error }] = useLoginMutation();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // on "unwrap" pour récupérer directement la réponse ou catch l'erreur
      const { accessToken, refreshToken } = await login({
        username,
        password,
      }).unwrap();

      // À ce stade, l’on sait que l’API a stocké :
      //   localStorage.setItem("access_token", accessToken);
      //   localStorage.setItem("refresh_token", refreshToken);
      // via onQueryStarted dans authApi.
      // On peut aussi vérifier/afficher du debug si on veut :
      console.log("Access Token : ", accessToken);
      console.log("Refresh Token:", refreshToken);

      // Rediriger vers la page protégée (exemple : "/profile" ou "/dashboard")
      navigate("/profile");
    } catch (err) {
      // L’erreur est déjà gérée par isError + error dans le JSX,
      // mais on peut logger en console pour voir le message exact :
      console.error("Login failed:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          maxWidth: 450,
          width: "100%",
          padding: 4,
          backgroundColor: "white",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          backdropFilter: "blur(10px)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
          },
        }}
      >
        {/* Logo Pokéball */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: "80px",
              height: "80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
              borderRadius: "50%",
              boxShadow: "0 4px 16px rgba(44, 62, 80, 0.3)",
              mb: 2,
            }}
          >
            <img
              src="/pokeball.png"
              alt="Pokéball"
              style={{
                width: "50px",
                height: "50px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            mb: 1,
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          Connexion
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{
            color: "#6c757d",
            mb: 3,
            fontSize: "1.1rem",
          }}
        >
          Rejoignez l'aventure Pokémon
        </Typography>

        <TextField
          label="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#2c3e50",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2c3e50",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#6c757d",
              "&.Mui-focused": {
                color: "#2c3e50",
              },
            },
          }}
        />

        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPwd(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#e0e0e0",
              },
              "&:hover fieldset": {
                borderColor: "#2c3e50",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2c3e50",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#6c757d",
              "&.Mui-focused": {
                color: "#2c3e50",
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          fullWidth
          sx={{
            background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
            color: "white",
            borderRadius: 2,
            py: 1.5,
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(135deg, #34495e 0%, #2c3e50 100%)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(44, 62, 80, 0.3)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Connexion"}
        </Button>

        {isError && (
          <Typography color="error" textAlign="center">
            {/* Dans RTK Query, error peut contenir un objet { data, status } 
              ou une string selon la configuration du baseQuery */}
            {typeof error === "string"
              ? error
              : "Erreur lors de la connexion. Vérifiez vos identifiants."}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LoginForm;
