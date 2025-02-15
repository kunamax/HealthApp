import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Stack,
  Divider,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  LocalDrink as WaterIcon,
  DirectionsWalk as StepsIcon,
  Bedtime as SleepIcon,
  Battery4Bar as EnergyIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router';
import { API_CONFIG } from '../config/api';
import Navbar from './Navbar';

function ReportsView() {
  const { user } = useAuth();
  const { get, loading, error } = useApi();
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoadingReports(true);
    const result = await get(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MY_DAILY_REPORTS));
    
    if (result.success) {
      setReports(result.data || []);
    }
    setLoadingReports(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEnergyLabel = (energy) => {
    if (energy <= 3) return { label: 'Niski', color: 'error' };
    if (energy <= 6) return { label: 'Średni', color: 'warning' };
    return { label: 'Wysoki', color: 'success' };
  };

  const getWaterProgress = (water) => {
    const recommended = 8;
    const percentage = Math.min((water / recommended) * 100, 100);
    return {
      percentage,
      color: percentage >= 100 ? 'success' : percentage >= 75 ? 'info' : 'warning'
    };
  };

  const getStepsProgress = (steps) => {
    const recommended = 10000;
    const percentage = Math.min((steps / recommended) * 100, 100);
    return {
      percentage,
      color: percentage >= 100 ? 'success' : percentage >= 75 ? 'info' : 'warning'
    };
  };

  const getSleepProgress = (sleep) => {
    const recommended = 8;
    const percentage = Math.min((sleep / recommended) * 100, 100);
    return {
      percentage,
      color: percentage >= 87.5 ? 'success' : percentage >= 75 ? 'info' : 'warning'
    };
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
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Moje raporty zdrowotne
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/daily-report')}
          >
            Dodaj nowy raport
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loadingReports ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : reports.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Brak raportów zdrowotnych
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Rozpocznij śledzenie swojego zdrowia, dodając pierwszy raport dzienny.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/daily-report')}
            >
              Dodaj pierwszy raport
            </Button>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {reports.map((report) => {
              const energyData = getEnergyLabel(report.energy);
              const waterProgress = getWaterProgress(report.water);
              const stepsProgress = getStepsProgress(report.steps);
              const sleepProgress = getSleepProgress(report.sleep);

              return (
                <Card key={report.dailyReportId} elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {formatDate(report.date)}
                      </Typography>
                      <Chip
                        icon={<EnergyIcon />}
                        label={`Energia: ${energyData.label}`}
                        color={energyData.color}
                        variant="outlined"
                      />
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <WaterIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle2">Woda</Typography>
                          </Box>
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            {report.water} szklanek
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={waterProgress.percentage}
                            color={waterProgress.color}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {waterProgress.percentage.toFixed(0)}% z zalecanego
                          </Typography>
                        </Paper>
                      </Grid>

                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <StepsIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle2">Kroki</Typography>
                          </Box>
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            {report.steps.toLocaleString()}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={stepsProgress.percentage}
                            color={stepsProgress.color}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {stepsProgress.percentage.toFixed(0)}% z 10k kroków
                          </Typography>
                        </Paper>
                      </Grid>

                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <SleepIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle2">Sen</Typography>
                          </Box>
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            {report.sleep}h
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={sleepProgress.percentage}
                            color={sleepProgress.color}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {sleepProgress.percentage.toFixed(0)}% z 8h snu
                          </Typography>
                        </Paper>
                      </Grid>

                      
                      <Grid item xs={12} sm={6} md={3}>
                        <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EnergyIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle2">Energia</Typography>
                          </Box>
                          <Typography variant="h5" sx={{ mb: 1 }}>
                            {report.energy}/10
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(report.energy / 10) * 100}
                            color={energyData.color}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {energyData.label} poziom energii
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}

        {reports.length > 0 && (
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              📊 Statystyki i trendy będą dostępne po zebraniu więcej danych
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
}

export default ReportsView;
