import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import { useEffect, useState } from 'react';
import { Typography, Fab, makeStyles, Container, Card, Zoom , Button} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { Pagination, PaginationItem } from '@material-ui/lab'
import axios from 'axios';
import useAuth from '../hooks/withUser';
import PostForm from '../components/PostForm';

export default function Board() {
	const [posts, setPosts] = useState(null);
	const [error, setError] = useState(false);
	const [showForm, setShowForm] = useState(false);
	const [pages, setPages] = useState(null);
	const [page, setPage] = useState(1);

	const pageHandler = (event, value) => {
		setPage(value);
		makeQuery(value)
	};
	const pageMapper = (pages) => pages <= 1 ? 0 : pages * 10 - 10;

	useAuth();

	const makeQuery = (page) => {
		axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/post/board/${pageMapper(page)}`, { withCredentials: true })
			.then(data => setPosts(data.data))
			.catch(() => setError(true));
		axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/post/count`, { withCredentials: true })
			.then(data => setPages(data.data.pages))
			.catch(() => setError(true));
	}

	useEffect(() => {
		makeQuery(page);
	}, []);

	const useStyles = makeStyles(theme => ({
		fab: {
			position: 'fixed',
			bottom: theme.spacing(5),
			right: theme.spacing(5),
			zIndex: 1
		},
		container: {
			marginTop: theme.spacing(3),
			display: 'flex',
			flexWrap: 'wrap',
			justifyContent: !error ? 'space-between' : 'center'
		},
		card: {
			maxWidth: theme.breakpoints.values.sm,
			padding: theme.spacing(2),
			margin: theme.spacing(3),
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
		},
		error: {
			alignSelf: 'center'
		},
		paginationContainer: {
			position: 'fixed',
			bottom: theme.spacing(5),
			display: 'flex',
			justifyContent: 'center',
			zIndex: 0
		}
	}))

	const classes = useStyles();

	if (!error) { return (
		<>
			<MainAppBar />
			<Container className={classes.container}>
				{posts ? posts.map((post, idx) => <Zoom in timeout={600 + (idx * 150)} key={post._id}>
					<Card className={classes.card}>
						<Typography variant="h5" align="center">{post.content}</Typography>
						<Typography variant="body2" color="textSecondary" align="right">- {post.owner.nickname}</Typography>
					</Card>
				</Zoom>) : ''}
			</Container>
			<Container maxWidth="xl">
			<Fab color="primary" aria-label="add-post" className={classes.fab} onClick={() => setShowForm(true)}>
				<Add />
			</Fab>
			<Container className={classes.paginationContainer} maxWidth="xl">
				<Pagination
					color="primary"
					page={page}
					count={pages}
					onChange={pageHandler}
					className={classes.pagination}
					hidePrevButton
					hideNextButton
					showFirstButton
					showLastButton
					renderItem={(item) => (
					<PaginationItem component={Button} {...item} disabled={item.selected} />
					)} />
			</Container>

			</Container>
			<PostForm open={showForm} setError={setError} close={setShowForm} query={makeQuery} state={posts} />

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