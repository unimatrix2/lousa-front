import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import { useContext, useEffect, useState } from 'react';
import { Typography, Fab, makeStyles, Container, Card, Zoom } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { useRouter } from 'next/router';
import axios from 'axios';
import useAuth from '../hooks/withUser';

export default function Board() {
	const { state } = useContext(Context);
	const router = useRouter();
	const [posts, setPosts] = useState(null);
	const [error, setError] = useState(false);

	useAuth();

	useEffect(() => {
			axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/post/board`, { withCredentials: true })
				.then(data => setPosts(data.data))
				.catch(() => setError(true));
	}, []);

	const useStyles = makeStyles(theme => ({
		fab: {
			position: 'fixed',
			bottom: theme.spacing(5),
			right: theme.spacing(5)
		},
		container: {
			marginTop: theme.spacing(3),
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: !error ? 'space-between' : 'center'
		},
		card: {
			maxWidth: theme.breakpoints.values.md,
			padding: theme.spacing(2),
			margin: theme.spacing(3),
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
		},
		content: {
			alignSelf: 'center',
		},
		owner: {
			alignSelf: 'flex-end',
			marginTop: theme.spacing(2)
		},
		error: {
			alignSelf: 'center'
		}
	}))

	const classes = useStyles();

		 if (!error) { return (
			<>
				<MainAppBar />
				<Container className={classes.container}>
				{posts ? posts.map((post, idx) => <Zoom in timeout={600 + (idx*100)} key={post._id}>
					<Card className={classes.card}>
						<Typography variant="h5" className={classes.content}>{post.content}</Typography>
						<Typography variant="body2" color="textSecondary" className={classes.owner}>- {post.owner.nickname}</Typography>
				</Card>
				</Zoom>) : ''}
				</Container>
				<Fab color="primary" aria-label="add-post" className={classes.fab}>
					<Add />
				</Fab>
			</>
		)} else return (
			<>
			<MainAppBar />
			<Container className={classes.container}>
				<Typography variant="h5" color="error">Houve um erro ao obter os posts, tente novamente mais tarde.</Typography>
			</Container>
			</>
		)
}