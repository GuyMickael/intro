import { useState, useEffect } from "react";
import { useRefreshMutation } from "../api/authApi";
import { useLazyGetProfileQuery } from "../api/profileApi";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";

export function FlowTester() {
  // 1. Hooks RTK Query pour authApi
  const [
    refresh,
    {
      isLoading: isRefreshLoading,
      isError: isRefreshError,
      error: refreshError,
      data: refreshData,
      isSuccess: isRefreshSuccess,
    },
  ] = useRefreshMutation();

  // 2. Hook RTK Query pour profileApi (lazy)
  const [
    triggerProfile,
    {
      data: profileData,
      error: profileError,
      isFetching: isProfileLoading,
      isSuccess: isProfileSuccess,
      isError: isProfileError,
    },
  ] = useLazyGetProfileQuery();

  // 3. États pour afficher tokens stockés
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // 4. Synchroniser tokens depuis localStorage
  const syncTokens = () => {
    setAccessToken(localStorage.getItem("access_token"));
    setRefreshToken(localStorage.getItem("refresh_token"));
  };

  useEffect(() => {
    syncTokens();
    const id = setInterval(syncTokens, 1000);
    return () => clearInterval(id);
  }, []);

  // 5. Handlers

  const handleGetProfile = () => {
    triggerProfile();
  };

  const handleRefresh = async () => {
    try {
      await refresh().unwrap();
      syncTokens();
    } catch {
      // Erreur affichée via isRefreshError
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Test JWT / Refresh Flow
      </Typography>

      {/* Affichage des tokens en localStorage */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">access_token :</Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={accessToken || "— aucun access_token —"}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <Typography variant="subtitle1">refresh_token :</Typography>
        <TextField
          fullWidth
          multiline
          minRows={2}
          value={refreshToken || "— aucun refresh_token —"}
          InputProps={{ readOnly: true }}
        />
      </Box>

      {/* Bouton pour GET /profile */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Profil Utilisateur</Typography>
        <Button
          variant="outlined"
          onClick={handleGetProfile}
          disabled={isProfileLoading}
          sx={{ mb: 1 }}
        >
          {isProfileLoading ? (
            <CircularProgress size={20} />
          ) : (
            "Charger /profile"
          )}
        </Button>
        {isProfileError && (
          <Typography color="error">
            {(profileError as any).data?.message || "Erreur /profile."}
          </Typography>
        )}
        {isProfileSuccess && profileData && (
          <Box component="pre" sx={{ background: "#f0f0f0", p: 1 }}>
            {JSON.stringify(profileData, null, 2)}
          </Box>
        )}
      </Box>

      {/* Bouton pour POST /refresh */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Refresh Token</Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleRefresh}
          disabled={isRefreshLoading}
          sx={{ mb: 1 }}
        >
          {isRefreshLoading ? (
            <CircularProgress size={20} />
          ) : (
            "Requêter /refresh"
          )}
        </Button>
        {isRefreshError && (
          <Typography color="error">
            {(refreshError as any).data?.message || "Erreur /refresh."}
          </Typography>
        )}
        {isRefreshSuccess && refreshData && (
          <Box>
            <Typography color="success.main">
              Nouveau accessToken généré !
            </Typography>
            <Box
              component="pre"
              sx={{
                background: "#f0f0f0",
                p: 1,
                mt: 1,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {JSON.stringify(refreshData, null, 2)}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
