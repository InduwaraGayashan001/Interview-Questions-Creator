// src/components/Layout.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, CssBaseline } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

export function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const isQAView = location.pathname === '/qa';

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'rgba(22, 20, 32, 0.95)',
                backdropFilter: 'blur(8px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}
        >
            <CssBaseline />
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 2,
                        height: '64px'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PsychologyIcon
                            sx={{
                                fontSize: 40,
                                color: 'primary.main',
                                mr: 1,
                            }}
                        />
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #00e5ff 10%,rgb(200, 0, 170) 90%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '0.05em'
                            }}
                        >
                            IntelliPrep
                        </Typography>
                    </Box>

                    {isQAView && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate('/')}
                        >
                            Back to Upload
                        </Button>
                    )}
                </Box>
            </Container>
        </Paper>
    );
}


export function Layout({ children }) {
    return (
        <Paper
            elevation={3}
            sx={{
                position: 'realative',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1000,
                background: 'rgba(32, 30, 61, 0.36)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
        >
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: '#121212',
                    color: 'white',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'url("/image.png")',
                        backgroundRepeat: 'repeat-y',
                        backgroundPosition: 'top center',
                        backgroundSize: 'cover',
                        opacity: 0.06,
                        zIndex: 0,
                        mb: 4,
                    },
                }}
            >
                <Header />
                <Box sx={{ pt: '80px', position: 'relative', zIndex: 1 }}>
                    {children}
                </Box>
            </Box>
        </Paper>
    );
}
