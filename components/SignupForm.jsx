import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography } from '@material-ui/core';
import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/Context';

export default function SignupForm({ classes }) {
	const { state, dispatch } = useContext(Context);
	const [user, setUser] = useState();
	const router = useRouter();
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

	useEffect(() => {
    if (user) {
      dispatch({
        type: 'PROVIDE_USER',
        payload: user
      });
    }
  }, [user]);
	
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
        const mapped = { nickname: values.nickname, email: values.email, password: values.password }
        const user = await axios.post(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/signup`, mapped, {
          withCredentials: true
        });
        setUser(user.data);
        router.push('/board');
      } catch (error) {
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
  });

	return (
		<Container className={classes.signupContainer} maxWidth="xs">
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
              type="submit"
            >
              Cadastrar
            </Button>
            </form>
    </Container>
	)
}