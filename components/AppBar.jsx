import { useState, useContext, useEffect } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Button
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import red from '@material-ui/core/colors/red';
import { Context } from '../context/Context';
import axios from 'axios';

export default function MainAppBar({ showLogin }) {

  const { state, dispatch } = useContext(Context);
  const [logout, setLogout] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    offline: {
      flexGrow: 1,
      color: red[700]
    },
    accountCircle: {
      marginRight: theme.spacing(1)
    }
  }));

  useEffect(() => {
    if (logout) {
      dispatch({
        type: 'PROVIDE_USER',
        payload: {}
      })
    }
  }, [logout])
  
  const classes = useStyles();

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const destroySession = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/logout`, {
      withCredentials: true
    });
    setLogout(true);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.offline}>{state.offline ? 'Server is not responding, data won\'t be fetched' : ''}</Typography>
            <div>
              {state.user?.nickname ? <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle className={classes.accountCircle} />
                <Typography>{state.user.nickname}</Typography>
              </IconButton> : ''}
              {!state.user?.nickname ?
              <>
              <Button color="inherit" onClick={() => showLogin(false)}>
              Registrar
              </Button>
              <Button color="inherit" onClick={() => showLogin(true)}>
              Acessar
              </Button>
              </> : ''}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={async () => { handleClose(); await destroySession(); }}>Logout</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
