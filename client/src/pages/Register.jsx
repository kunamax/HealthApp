import {
  Button,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router';
import { useState } from 'react';
import { API_CONFIG } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    weight: '',
    lifestyle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const lifestyleOptions = [
    { value: 'SEDENTARY', label: 'Siedzący (biurowa praca, brak ćwiczeń)' },
    { value: 'LIGHTLY_ACTIVE', label: 'Lekko aktywny (lekkie ćwiczenia 1-3 dni/tydzień)' },
    { value: 'MODERATELY_ACTIVE', label: 'Umiarkowanie aktywny (ćwiczenia 3-5 dni/tydzień)' },
    { value: 'VERY_ACTIVE', label: 'Bardzo aktywny (intensywne ćwiczenia 6-7 dni/tydzień)' },
    { value: 'EXTRA_ACTIVE', label: 'Ekstremalnie aktywny (bardzo intensywne ćwiczenia, praca fizyczna)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (error) setError('');
    if (success) setSuccess(false);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('Imię jest wymagane');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Nazwisko jest wymagane');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email jest wymagany');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Podaj prawidłowy adres email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Hasło musi mieć co najmniej 6 znaków');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return false;
    }
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError('Wiek musi być liczbą między 1 a 120');
      return false;
    }
    if (!formData.weight || formData.weight < 1 || formData.weight > 500) {
      setError('Waga musi być liczbą między 1 a 500 kg');
      return false;
    }
    if (!formData.lifestyle) {
      setError('Wybierz styl życia');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const result = await register(registerData);

      if (result.success) {
        setSuccess(true);
        setError('');
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Konto zostało utworzone! Możesz się teraz zalogować.' 
            } 
          });
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          Rejestracja
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Konto zostało utworzone pomyślnie! Przekierowywanie do logowania...
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Imię"
                value={formData.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Nazwisko"
                value={formData.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </Box>

            <TextField
              fullWidth
              id="email"
              name="email"
              label="Adres email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Hasło"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              helperText="Minimum 6 znaków"
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Potwierdź hasło"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                id="age"
                name="age"
                label="Wiek"
                type="number"
                value={formData.age}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 120 }}
              />
              <TextField
                fullWidth
                id="weight"
                name="weight"
                label="Waga (kg)"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
                inputProps={{ min: 1, max: 500, step: 0.1 }}
              />
            </Box>

            <FormControl fullWidth required>
              <InputLabel id="lifestyle-label">Styl życia</InputLabel>
              <Select
                labelId="lifestyle-label"
                id="lifestyle"
                name="lifestyle"
                value={formData.lifestyle}
                label="Styl życia"
                onChange={handleChange}
              >
                {lifestyleOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Wybierz opcję najbardziej opisującą Twój poziom aktywności</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || success}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading ? 'Tworzenie konta...' : success ? 'Konto utworzone!' : 'Zarejestruj się'}
            </Button>

            <Box textAlign="center">
              <Link component={RouterLink} to="/login" variant="body2">
                Masz już konto? Zaloguj się
              </Link>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
