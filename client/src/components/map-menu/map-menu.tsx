import { useContext, useEffect } from 'react';
import NavBar from '../nav-bar/nav-bar';
import classes from './map-menu.module.css';
import SocketConnectionContext from '../../store/SocketConnectionContext';
import UserList from '../user-list/user-list';

export default function MapMenu() {
	const { sessionId, userId, users, socket, map } = useContext(
		SocketConnectionContext
	);

	useEffect(() => {
		console.log('from menu: ', users);
	}, [users]);

	return (
		<div className={classes.menu}>
			<NavBar />
			<UserList users={users}/>
		</div>
	);
}
