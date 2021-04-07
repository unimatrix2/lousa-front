import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle } from '@material-ui/core';
import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/Context';

export default function PostForm({ setError, open, close, query, state }) {

	const postSchema = yup.object({
    nickname: yup
      .string()
      .trim()
      .matches(/[^.$]/, 'Não pode conter "." ou "$"')
      .max(250, 'Precisa conter no máximo 250 caracteres'),
  });
	
  const formik = useFormik({
    initialValues: { content: '' },
    validationSchema: postSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/post/create`, values, {
          withCredentials: true
        });
        values.content = '';
        query();
      } catch (error) { setError(true); }
    }
  });
	return (
		<Dialog open={open} onClose={() => close(false)} fullWidth>
      <DialogTitle>Criar Post</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            required
            fullWidth
            variant="standard"
            label="Escreva seu post"
            name="content"
            id="content"
            multiline
            //className={classes.formField}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
            value={formik.values.content}
            onChange={formik.handleChange}
          />
        </DialogContent>
      <DialogActions>
        <Button
            variant="contained"
            color="primary"
            type="submit"
            onClick={() => close(false) }
            >
              Criar Post
            </Button>
      </DialogActions>
      </form>
    </Dialog>
	)
}