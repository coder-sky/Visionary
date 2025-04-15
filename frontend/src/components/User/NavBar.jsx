import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import Logout from '@mui/icons-material/Logout';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Stack, Toolbar } from '@mui/material';
import { AccountBox, Analytics, Insights, LockOpen, Source } from '@mui/icons-material';
import { LinearGradient } from 'react-text-gradients';
import { UserContext } from '../Common/Context/UserContext';


export default function NavBar() {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const open = Boolean(anchorEl);
    const userContext = useContext(UserContext)
    const navigate = useNavigate()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = ()=>{
        localStorage.removeItem('token')
        navigate('/login')
    }
    return (
        <React.Fragment>
            <AppBar position="fixed" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', }} >
                <Toolbar>
                    <Link to='/home'  style={{display:'flex', alignItems:'center', flexGrow:1}}>
                    <Typography  variant="h5" component="p" className='logo' display={'flex'} alignItems={'center'} sx={{ color: '#ff68f0 ', flexGrow: 1, fontWeight: 'bolder' }}>
                        <Insights />
                        <LinearGradient gradient={['to left', '#17acff ,#ff68f0']}>
                            Visionary
                        </LinearGradient>
                    </Typography>
                    </Link>
                    <Box>
                        <>
                            <Stack id='navMenu' direction={'row'} spacing={{ xs: 1, md: 2 }} alignItems={'center'}>
                                <Link to={'/graphs-creation'} style={{ color: 'black', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3, }}><Analytics /> Graphs</Link>
                                <Link to={'/workspace'} style={{ color: 'black', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 3 }}><Source /> Workspace</Link>
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff0e99' }}>{userContext?.user?.name[0]}</Avatar>
                                </IconButton>
                            </Stack>

                        </>
                    </Box>

                </Toolbar>

            </AppBar>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={()=>navigate('/profile')}>
                    <ListItemIcon>
                        <AccountBox fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={()=>navigate('/change-password')}>
                    <ListItemIcon>
                        <LockOpen fontSize="small" />
                    </ListItemIcon>
                    Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
