import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Typography, Container, Paper, makeStyles, Button, TextField } from '@material-ui/core';
import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import { useFormik } from 'formik';
import { RestoreOutlined } from '@material-ui/icons';

export default function Home() {
  // Get context, router & define states
  const { state, dispatch } = useContext(Context);
  const router = useRouter();
  const [user, setUser] = useState();
  
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
    dispatch({
      type: 'PROVIDE_USER',
      payload: user
    })
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

  // Form validation schema
  const signupSchema = yup.object({
    nickname: yup
      .string()
      .trim()
      .matches(/[^.$]/, 'Não pode conter "." ou "$"')
      .min(5, 'Precisa conter ao menos 5 caracteres')
      .max(20, 'Precisa conter no máximo 20 caracteres')
      .required('Campo obrigatório'),
    email: yup
      .string()
      .trim()
      .email('Digite um email válido')
      .required('Campo obrigatório'),
    password: yup
      .string()
      .trim()
      .matches(/[A-Z]/, 'Ao menos uma letra maiúscula')
      .matches(/[a-z]/, 'Ao menos uma letra minúscula')
      .matches(/[!@#%^&*+=_?-]/, 'Ao menos um caractere especial')
      .matches(/[^.$]/, 'Não pode conter "." ou "$"')
      .min(8, 'Ao menos 8 caracteres')
      .max(50, 'No máximo 50 caracteres')
      .required('Campo obrigatório'),
    confirmPassword: yup
      .string()
      .trim()
      .oneOf([yup.ref('password'), null], 'Senhas diferentes')
      .required('Campo obrigatório')
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: signupSchema,
    onSubmit: async (values, helpers) => {
      try {
        delete values.confirmPassword;
        const user = await axios.post(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/signup`, values, {
          withCredentials: true
        });
        values.confirmPassword = '';
        setUser(user.data);
        setTimeout(() => router.push('/board'), 300)
      } catch (error) {
        values.confirmPassword = '';
        if (error.response.data?.type === 'User-Repo-Create-nickname') {
          helpers.setFieldError('nickname', 'Já existe um usuário com esse apelido');
        }
        if (error.response.data?.type === 'User-Repo-Create-email') {
          helpers.setFieldError('email', 'Já existe um usuário com esse email');
        }
        if (error.response.data?.type === 'User-Exists') {
          helpers.setFieldError('nickname', 'Essa conta já existe');
          helpers.setFieldError('email', 'Essa conta já existe');
        }
      }
    }
  })

  return (
  <>
    <MainAppBar />
    <Container className={classes.titleContainer}>
        <Typography variant="h1" align="center">A Lousa</Typography>
        <Typography variant="h5" color="textSecondary" align="center">Suas ideias para o mundo</Typography>
    </Container>
    <Container className={classes.textContainer}>
      <Typography variant="h5" color="textSecondary" align="center">Faça parte da maior lousa da internet, é só criar uma conta e sair escrevendo!</Typography>
    </Container>
    {!user?.nickname ? <Container className={classes.signupContainer} maxWidth="xs">
      <Typography variant="h5">Registre-se</Typography>
            <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              required
              fullWidth
              variant="standard"
              label="Apelido"
              name="nickname"
              id="nickname"
              className={classes.formField}
              error={formik.touched.nickname && Boolean(formik.errors.nickname)}
              helperText={formik.touched.nickname && formik.errors.nickname}
              value={formik.values.nickname}
              onChange={formik.handleChange}
            />
            <TextField
              required
              fullWidth
              variant="standard"
              label="E-Mail"
              name="email"
              id="email"
              className={classes.formField}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              required
              fullWidth
              type="password"
              variant="standard"
              label="Senha"
              name="password"
              id="password"
              className={classes.formField}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <TextField
              required
              fullWidth
              type="password"
              variant="standard"
              label="Confirme sua senha"
              name="confirmPassword"
              id="confirmPassword"
              className={classes.formField}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              type="submit"
            >
              Cadastrar
            </Button>
            </form>
    </Container> : ''}
  </>
  );
}