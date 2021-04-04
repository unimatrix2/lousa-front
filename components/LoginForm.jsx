import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography } from '@material-ui/core';
import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/Context';

export default function LoginForm({ classes }) {
	const { state, dispatch } = useContext(Context);
	const [user, setUser] = useState();
	const router = useRouter();
	const signupSchema = yup.object({
    nickname: yup
      .string()
      .trim()
      .matches(/[^.$]/, 'Não pode conter "." ou "$"')
      .min(5, 'Precisa conter ao menos 5 caracteres')
      .max(20, 'Precisa conter no máximo 20 caracteres'),
    email: yup
      .string()
      .trim()
      .email('Digite um email válido'),
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
  });

	useEffect(() => {
    if (user) {
      dispatch({
        type: 'PROVIDE_USER',
        payload: user
      });
    }
  }, [user]);

  const formValuesMapper = (values) => {
      values.nickname && !values.email
      ? delete values.email
      : delete values.nickname;
      return values;
    };
	
  const formik = useFormik({
    initialValues: {
      nickname: '',
      email: '',
      password: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values, helpers) => {
      try {
        const mapped = formValuesMapper(values)
        const user = await axios.post(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/login`, mapped, {
          withCredentials: true
        });
        setUser(user.data);
        setTimeout(() => router.push('/board'), 300)
      } catch (error) {
        if (error.response.data?.type === 'User-Invalid-Credentials') {
          helpers.setFieldError('nickname', 'Usuário ou senha incorretos');
          helpers.setFieldError('email', 'Usuário ou senha incorretos');
          helpers.setFieldError('password', 'Usuário ou senha incorretos');
        }
      }
    }
  });
	return (
		<Container className={classes.signupContainer} maxWidth="xs">
      <Typography variant="h5">Acessar</Typography>
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
              disabled={!formik.values.nickname && Boolean(formik.values.email)}
            />
            <Typography>ou</Typography>
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
              disabled={!formik.values.email && Boolean(formik.values.nickname)}
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
            <Button
              variant="contained"
              color="primary"
              className={classes.submitButton}
              type="submit"
            >
              Entrar
            </Button>
            </form>
    </Container>
	)
}