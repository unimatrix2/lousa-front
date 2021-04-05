import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  makeStyles,
  Zoom,
  Fade,
  Slide,
  Paper,
  Button
} from '@material-ui/core';
import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import SignupForm from '../components/SignupForm';
import LoginForm from '../components/LoginForm';
import { useRouter } from 'next/router';

export default function Home() {
  // Get context, router & define states
  const { state, dispatch } = useContext(Context);
  const [user, setUser] = useState();
  const [loginForm, setLoginForm] = useState(false);
  const [transition, setTransition] = useState(false);
  const router = useRouter();
  
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
      alignItems: 'center',
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
    invisible: {
      color: 'transparent'
    },
    slider: {
      display: 'flex',
      flexDirection: 'row',
      overflow: state.user?.nickname ? 'visible' : 'hidden',
      justifyContent: 'center'
    },
    paper: {
      width: '100%'
    }
  }));
  
  const classes = useStyles();

  return (
  <>
    <MainAppBar showLogin={setLoginForm} signupOut={setTransition} />
    <Zoom in timeout={1000}>
      <Container className={classes.titleContainer}>
        <Typography variant="h1" align="center">A Lousa</Typography>
        <Typography variant="h5" color="textSecondary" align="center">Suas ideias para o mundo</Typography>
      </Container>
    </Zoom>
    <Fade in={!loginForm && !state.user?.nickname} timeout={{enter: 3000, exit: 500 }}>
      <Container className={classes.textContainer}>
        <Typography variant="h5" color="textSecondary" align="center">Faça parte da maior lousa da internet, é só criar uma conta e sair escrevendo!</Typography>
      </Container>
    </Fade>
    {!state.user?.nickname ? <Container className={classes.slider} maxWidth="md">
      <Slide in={!loginForm} mountOnEnter unmountOnExit direction={!loginForm && !transition
        ? "up"
        : !loginForm && transition
        ? "right"
        : "right"} timeout={!loginForm ? 2000 : 200}>
          <Paper elevation={0} className={classes.paper}>
            <SignupForm classes={classes} />
          </Paper>
      </Slide>
      <Slide in={loginForm} mountOnEnter unmountOnExit direction="left" timeout={loginForm ? 2000 : loginForm && transition ? 2000 : 200}>
          <Paper elevation={0} className={classes.paper}>
            <LoginForm classes={classes} />
          </Paper>
      </Slide>
    </Container> : <Zoom in timeout={1000}>
        <Container className={classes.slider}>
        <Button variant="contained" color="primary" onClick={() => router.push('/board')}>
          Ir para a Lousa
        </Button>
        </Container>
    </Zoom>}
  </>
  );
}