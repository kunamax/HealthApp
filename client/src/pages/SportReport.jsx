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

function SportReport() {
  const { user } = useAuth();
  const { post, loading, error } = useApi();
  const navigate = useNavigate();

  // const [formData, setFormData] = useState({
  //   activitytype: "Bieganie",
  //   calories: 300,
  //   minheartbeat: 80,
  //   maxheartbeat: 180,
  //   duration: 
  // })

  return (
    <>
			<Navbar />

			<Container maxWidth="md" sx={{ mt: 4 }}>
				<Typography variant="h4" gutterBottom>
					Trening
				</Typography>

				<Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
					Wypełnij parametry swojego treningu
				</Typography>

        {/* <Card>
          <CardContent>
            
          </CardContent>
        </Card> */}
			</Container>
    </>
  )
}

export default SportReport;