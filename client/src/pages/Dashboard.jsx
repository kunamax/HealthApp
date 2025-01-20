import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import Navbar from './Navbar';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar/>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Witaj, {user?.firstName}!
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Twój profil
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {user?.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Wiek:</strong> {user?.age} lat
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Waga:</strong> {user?.weight} kg
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Styl życia:</strong> {user?.lifestyle}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Funkcje aplikacji
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={() => navigate('/reports')}>
                  Raporty zdrowia
                </Button>
                <Button variant="contained" onClick={() => navigate('/stats')}>
                  Statystyki
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}

export default Dashboard;
