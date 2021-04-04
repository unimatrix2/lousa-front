import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Typography, Container, makeStyles } from '@material-ui/core';
import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import { RestoreOutlined } from '@material-ui/icons';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';

export default function Home() {
  // Get context, router & define states
  const { state, dispatch } = useContext(Context);
  const [user, setUser] = useState();
  const [loginForm, setLoginForm] = useState(false);
  
  // Side effects
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/token`, {
      withCredentials: true
    })
      .then(data => {
        setUser(data.data);
      })
      .catch(err => {
        if (err.message === 'Network Error') {
          dispatch({
            type: 'OFFLINE',
            payload: true
          });
        }
      });
  }, []);

  useEffect(() => {
    if (user) {
      dispatch({
        type: 'PROVIDE_USER',
        payload: user
      });
    }
  }, [user]);

  // Styling
  const useStyles = makeStyles((theme) => ({
    titleContainer: {
      marginTop: theme.spacing(10),
      display: 'flex',
      flexDirection: 'column'
    },
    textContainer: {
      marginTop: theme.spacing(5),
    },
    signupContainer: {
      marginTop: theme.spacing(3),
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    form: {
      marginTop: theme.spacing(4),
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    formField: {
      marginBottom: theme.spacing(4)
    },
    submitButton: {
      alignSelf: 'flex-end'
    }
  }));
  
  const classes = useStyles();

  return (
  <>
    <MainAppBar showLogin={setLoginForm} />
    <Container className={classes.titleContainer}>
        <Typography variant="h1" align="center">A Lousa</Typography>
        <Typography variant="h5" color="textSecondary" align="center">Suas ideias para o mundo</Typography>
    </Container>
    <Container className={classes.textContainer}>
      <Typography variant="h5" color="textSecondary" align="center">Faça parte da maior lousa da internet, é só criar uma conta e sair escrevendo!</Typography>
    </Container>
    {!state.user?.nickname && !loginForm ? <SignupForm classes={classes} /> : ''}
    {!state.user?.nickname && loginForm ? <LoginForm classes={classes} /> : ''}
  </>
  );
}