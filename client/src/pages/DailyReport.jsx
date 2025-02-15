import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress,
  Slider,
  Grid,
  InputAdornment,
} from '@mui/material';
import {
  LocalDrink as WaterIcon,
  DirectionsWalk as StepsIcon,
  Bedtime as SleepIcon,
  Battery4Bar as EnergyIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router';
import { API_CONFIG } from '../config/api';
import Navbar from './Navbar';

function DailyReport() {
  const { user } = useAuth();
  const { post, loading, error } = useApi();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    water: 8,
    steps: 5000,
    sleep: 7,
    energy: 5,
  });
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event, newValue) => {
    const value = newValue !== undefined ? newValue : event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    if (submitError) setSubmitError('');
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    if (formData.water < 0 || formData.water > 20) {
      setSubmitError('Ilość wody musi być między 0 a 20 szklankami');
      return false;
    }
    if (formData.steps < 0 || formData.steps > 50000) {
      setSubmitError('Liczba kroków musi być między 0 a 50,000');
      return false;
    }
    if (formData.sleep < 0 || formData.sleep > 24) {
      setSubmitError('Czas snu musi być między 0 a 24 godzinami');
      return false;
    }
    if (formData.energy < 1 || formData.energy > 10) {
      setSubmitError('Poziom energii musi być między 1 a 10');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitError('');

    const reportData = {
      water: parseInt(formData.water),
      steps: parseInt(formData.steps),
      sleep: parseInt(formData.sleep),
      energy: parseInt(formData.energy),
    };

    const result = await post(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CREATE_DAILY_REPORT), reportData);

    if (result.success) {
      setSuccess(true);
      setSubmitError('');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setSubmitError(result.error || 'Wystąpił błąd podczas zapisywania raportu');
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dzienny raport zdrowotny
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Wypełnij swój dzienny raport zdrowotny za dzisiaj
        </Typography>

        <Card>
          <CardContent>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Raport został zapisany pomyślnie! Przekierowywanie na dashboard...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                
                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <WaterIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Spożycie wody
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <TextField
                          type="number"
                          value={formData.water}
                          onChange={handleChange('water')}
                          inputProps={{ min: 0, max: 20 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">szklanek</InputAdornment>
                          }}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <FormHelperText>
                      Zalecane: 8 szklanek dziennie (około 2 litry)
                    </FormHelperText>
                  </CardContent>
                </Card>

                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <StepsIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Liczba kroków
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <TextField
                          type="number"
                          value={formData.steps}
                          onChange={handleChange('steps')}
                          inputProps={{ min: 0, max: 50000, step: 100 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">kroków</InputAdornment>
                          }}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <FormHelperText>
                      Zalecane: 10,000 kroków dziennie
                    </FormHelperText>
                  </CardContent>
                </Card>

                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SleepIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Czas snu
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <TextField
                          type="number"
                          value={formData.sleep}
                          onChange={handleChange('sleep')}
                          inputProps={{ min: 0, max: 24, step: 0.5 }}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">godzin</InputAdornment>
                          }}
                          size="small"
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                    <FormHelperText>
                      Zalecane: 7-9 godzin dla dorosłych
                    </FormHelperText>
                  </CardContent>
                </Card>

                
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EnergyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Poziom energii
                      </Typography>
                    </Box>
                    
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={4}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={formData.energy}
                            onChange={(e) => handleChange('energy')(e)}
                          >
                            {[1,2,3,4,5,6,7,8,9,10].map(num => (
                              <MenuItem key={num} value={num}>
                                {num} - {num <= 3 ? 'Niski' : num <= 6 ? 'Średni' : 'Wysoki'}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <FormHelperText>
                      Oceń swój obecny poziom energii w skali 1-10
                    </FormHelperText>
                  </CardContent>
                </Card>

                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Anuluj
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || success}
                    startIcon={loading && <CircularProgress size={20} />}
                  >
                    {loading ? 'Zapisywanie...' : success ? 'Zapisano!' : 'Zapisz raport'}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default DailyReport;
