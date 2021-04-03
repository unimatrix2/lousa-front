import MainAppBar from '../components/AppBar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Container } from '@material-ui/core';
import { Dashboard } from '@material-ui/icons';

export default function Home() {
  const [user, setUser] = useState();
  const [offline, setOffline] = useState(null);
  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth/token`)
      .then(data => setUser(data.data))
      .catch(err => console.log(err));
  }, []);
  console.log(user);
  return (
  <>
    <MainAppBar user={user} offline={offline} />
  </>
  );
}