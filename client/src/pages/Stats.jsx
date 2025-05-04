import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../hooks/useApi';
import { API_CONFIG } from '../config/api';
import Navbar from './Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Stats() {
  const { user } = useAuth();
  const { get, loading, error } = useApi();
  
  const [reports, setReports] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setFetchError('');
    const result = await get(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MY_DAILY_REPORTS));
    
    if (result.success) {
      setReports(result.data);
    } else {
      setFetchError(result.error || 'Nie udało się pobrać raportów');
    }
  };

  const getFilteredReports = () => {
    const daysAgo = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    return reports
      .filter(report => new Date(report.date) >= cutoffDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const filteredReports = getFilteredReports();

  const chartLabels = filteredReports.map(report => 
    new Date(report.date).toLocaleDateString('pl-PL', { 
      month: 'short', 
      day: 'numeric' 
    })
  );

  const waterSleepData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Woda (szklanki)',
        data: filteredReports.map(report => report.water),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.2)',
        tension: 0.3,
      },
      {
        label: 'Sen (godziny)',
        data: filteredReports.map(report => report.sleep),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.3,
      },
    ],
  };

  const stepsData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Kroki',
        data: filteredReports.map(report => report.steps),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const averageEnergy = filteredReports.length > 0 
    ? filteredReports.reduce((sum, report) => sum + report.energy, 0) / filteredReports.length 
    : 0;

  const energyData = {
    labels: ['Energia', 'Pozostała energia'],
    datasets: [
      {
        data: [averageEnergy, 10 - averageEnergy],
        backgroundColor: [
          'rgba(255, 206, 86, 0.8)',
          'rgba(201, 203, 207, 0.3)',
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Woda i Sen w czasie',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dzienna liczba kroków',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: `Średni poziom energii: ${averageEnergy.toFixed(1)}/10`,
      },
    },
  };

  const getStats = () => {
    if (filteredReports.length === 0) return null;

    const totalWater = filteredReports.reduce((sum, r) => sum + r.water, 0);
    const totalSteps = filteredReports.reduce((sum, r) => sum + r.steps, 0);
    const totalSleep = filteredReports.reduce((sum, r) => sum + r.sleep, 0);
    const avgEnergy = filteredReports.reduce((sum, r) => sum + r.energy, 0) / filteredReports.length;

    return {
      avgWater: (totalWater / filteredReports.length).toFixed(1),
      avgSteps: Math.round(totalSteps / filteredReports.length),
      avgSleep: (totalSleep / filteredReports.length).toFixed(1),
      avgEnergy: avgEnergy.toFixed(1),
      totalDays: filteredReports.length,
    };
  };

  const stats = getStats();

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
        <Typography variant="h4" gutterBottom>
          Statystyki zdrowotne
        </Typography>

        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Zakres czasowy</InputLabel>
            <Select
              value={timeRange}
              label="Zakres czasowy"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Ostatnie 7 dni</MenuItem>
              <MenuItem value="30">Ostatnie 30 dni</MenuItem>
              <MenuItem value="90">Ostatnie 90 dni</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {fetchError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" sx={{ my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {stats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats.avgWater}
                </Typography>
                <Typography variant="body2">
                  Średnia ilość wody (szklanki/dzień)
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats.avgSteps.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Średnia liczba kroków/dzień
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats.avgSleep}h
                </Typography>
                <Typography variant="body2">
                  Średnia ilość snu/noc
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" color="primary">
                  {stats.avgEnergy}/10
                </Typography>
                <Typography variant="body2">
                  Średni poziom energii
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {filteredReports.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Line data={waterSleepData} options={lineChartOptions} />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Box sx={{ maxWidth: 300, margin: '0 auto' }}>
                    <Doughnut data={energyData} options={doughnutOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Bar data={stepsData} options={barChartOptions} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          !loading && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Brak danych do wyświetlenia dla wybranego zakresu czasowego. 
              Dodaj kilka raportów dziennych, aby zobaczyć wykresy!
            </Alert>
          )
        )}
      </Container>
    </>
  );
}

export default Stats;
