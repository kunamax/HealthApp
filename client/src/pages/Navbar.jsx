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
import { useNavigate, useLocation } from 'react-router';

function Navbar () {
	const { user, logout} = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const navItems = [
		{ label: 'Dashboard', path: '/dashboard' },
		{ label: 'Raporty', path: '/reports' },
		{ label: 'Nowy raport', path: '/daily-report' },
		{ label: 'Statystyki', path: '/stats'},
		{ label: 'Dodaj nowy trening', path: '/sport-report'}
	];

	return (
		<AppBar position="static">
			<Toolbar>
				<Typography 
					variant="h6" 
					component="div" 
					sx={{ flexGrow: 1, cursor: 'pointer' }} 
					onClick={() => navigate('/dashboard')}
				>
					Health App
				</Typography>
				
				<Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
					{navItems.map((item) => (
						<Button
							key={item.path}
							color="inherit"
							onClick={() => navigate(item.path)}
							sx={{
								backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
								'&:hover': {
									backgroundColor: 'rgba(255, 255, 255, 0.2)',
								},
							}}
						>
							{item.label}
						</Button>
					))}
				</Box>
					
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
	);
}

export default Navbar;