import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Context } from '../context/Context';

export default function useAuth() {
	const [user, setUser] = useState();
	const { state, dispatch } = useContext(Context);

	useEffect(() => {
		if (!state.user?.nickname) {
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
		}
	}, []);

	useEffect(() => {
		if (user) {
			dispatch({
				type: 'PROVIDE_USER',
				payload: user
			});
		}
	}, [user]);
}