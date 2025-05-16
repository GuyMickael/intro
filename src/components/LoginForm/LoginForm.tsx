import { useState } from "react";
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
  const [login, { isLoading, isError }] = useLoginMutation();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password }); // le JWT est posé dans localStorage
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
        type="text"
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
          Erreur
        </Typography>
      )}
    </Box>
  );
}
export default LoginForm;
