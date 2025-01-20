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
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            navigate('/login', { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.email, formData.password);

        if (result.success) {
            const from = location.state?.from?.pathname || '/dashboard';
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    mt: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h4" gutterBottom>
                    Logowanie
                </Typography>

                {successMessage && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <Stack spacing={2}>
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
                            autoFocus
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
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                            startIcon={loading && <CircularProgress size={20} />}
                        >
                            {loading ? 'Logowanie...' : 'Zaloguj się'}
                        </Button>

                        <Box textAlign="center">
                            <Link component={RouterLink} to="/register" variant="body2">
                                Nie masz konta? Zarejestruj się
                            </Link>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;