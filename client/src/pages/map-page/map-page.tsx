import React, { useContext, useEffect, useState } from 'react';
import SocketConnectionProvider from '../../store/SocketConnectionProvider';
import NameInput from '../../components/name-input/name-input';
import NavBar from '../../components/nav-bar/nav-bar';
import Map from '../../components/map/map';
import classes from './map-page.module.css';
import MapMenu from '../../components/map-menu/map-menu';
import SocketConnectionContext from '../../store/SocketConnectionContext';
import { useParams } from 'react-router-dom';

export default function MapPage() {
	const [username, setUsername] = useState('');
	const [isModalShown, setIsModalShown] = useState(true);
	const params = useParams();

	const { sessionId, userId, users, socket, map, setSessionId } = useContext(
		SocketConnectionContext
	);

	useEffect(() => {
		if (setSessionId) {
			setSessionId(params.id ? params.id : ''); 
      console.log(params.id);
		}
	}, [params.id]);

	const setUsernameHandler = (newUsername: string) => {
		console.log(newUsername);
		setUsername(newUsername);
		setIsModalShown(false);
	};

	useEffect(() => {
    console.log(socket, username, 'from map page');
		if (socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					id: sessionId,
					userId: userId,
					method: 'usernameChange',
					newUsername: username,
				})
			);
		}
	}, [socket, username]);

	return (
		<div className={classes.mapBody}>
			{isModalShown && (
				<NameInput onSetUsername={setUsernameHandler}></NameInput>
			)}
			<MapMenu />
			<Map username={username} />
		</div>
	);
}
