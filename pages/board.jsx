import { Context } from '../context/Context';
import MainAppBar from '../components/AppBar';
import { useContext, useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';

export default function Board() {
	const { state } = useContext(Context);
	const router = useRouter();
	useEffect(() => {
		if (!state.user?.nickname) {
			router.push('/');
		}
	}, [state])

	if (state.user?.nickname) {
		return (
			<>
				<MainAppBar />
				<Typography>{JSON.stringify(state)}</Typography>
			</>
		)

	} else return <></>
}