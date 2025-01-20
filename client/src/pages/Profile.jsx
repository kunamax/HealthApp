import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useApi } from '../hooks/useApi';

function Profile() {
  const [profile, setProfile] = useState(null);
  const { get, loading, error } = useApi();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const result = await get('http://localhost:5000/api/users/profile');
    if (result.success) {
      setProfile(result.data);
    }
  };

  const refreshProfile = () => {
    loadProfile();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Mój Profil
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Informacje o użytkowniku
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>ID:</strong> {profile.userId}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Imię:</strong> {profile.firstName}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Nazwisko:</strong> {profile.lastName}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {profile.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Wiek:</strong> {profile.age}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Waga:</strong> {profile.weight} kg
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Styl życia:</strong> {profile.lifestyle}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={refreshProfile}
                disabled={loading}
              >
                Odśwież profil
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}

export default Profile;
