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
      component="form"
      onSubmit={submit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        margin: "0 auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 1,
        marginLeft: "200px",
      }}
    >
      <Typography variant="h5" textAlign="center">
        Login
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPwd(e.target.value)}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isLoading}
        fullWidth
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
  );
}

export default LoginForm;
