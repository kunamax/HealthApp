import React from 'react';
import {
  Typography,
  Box,
  Button,
  AppBar,
  Toolbar,
  Avatar,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';

function Navbar () {
	const { user, logout} = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => {navigate('/dashboard')}}>
						Health App
				</Typography>
					
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<Avatar sx={{ bgcolor: 'secondary.main' }}>
						{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
					</Avatar>
					<Typography variant="body1">
						{user?.firstName} {user?.lastName}
					</Typography>
					<Button color="inherit" onClick={handleLogout}>
						Wyloguj
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navbar