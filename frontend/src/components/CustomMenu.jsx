import * as React from 'react';
import {
  MenuItem,
  MenuList,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Stack,
  Menu,
} from '@mui/material';
import {
  AccountPreview,
  SignOutButton,
  AccountPopoverFooter,
} from '@toolpad/core/Account';
import AddIcon from '@mui/icons-material/Add';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const accounts = [
  {
    id: 1,
    name: 'Bharat Kashyap',
    email: 'bharatkashyap@outlook.com',
    image: 'https://avatars.githubusercontent.com/u/19550456',
  },
  {
    id: 2,
    name: 'Bharat MUI',
    email: 'bharat@mui.com',
    color: '#8B4513', // Brown color
  },
];

export default function CustomMenu() {
  return (
    <Stack direction="column">
      <>
        
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </>
      
    </Stack>
  );
}
