import SocketConnectionContext from './SocketConnectionContext';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { SocketContext } from '../types/session.type';
import { User } from '../types/user.type';

type SocketConnectionProviderProps = {
	children: React.ReactNode;
};

export default function SocketConnectionProvider(
	props: SocketConnectionProviderProps
) {
	const { children } = props;
	const [userId, setUserId] = useState(uuid().slice(0, 8));
	const [selectedMap, setSelectedMap] = useState('');
	const [users, setUsers] = useState<User[]>([]);
	const [username, setUsername] = useState('');
	const [sessionId, setSessionId] = useState('');
	const [socket, setSocket] = useState<WebSocket | undefined>();
	const params = useParams();

	const [value, setValue] = useState<SocketContext>({
		sessionId: sessionId,
		userId: userId,
		users: users,
		socket: socket,
		map: selectedMap,
		setSessionId: setSessionId,
		setUsers: setUsers
	});

	const parseUsers = (msg: any) => {
		console.log('users set', msg.users);
		setUsers(JSON.parse(JSON.stringify(msg.users)));
	};

	const userActionHandler = (msg: any) => {
		let currentUserId = msg.userId;
		let currentUserIndex = users.findIndex(
			(user) => user.userId === currentUserId
		);
		console.log(currentUserIndex, users);
		setUsers((state) => [
			...state.slice(0, currentUserIndex),
			{
				...state[currentUserIndex],
				pinShown: true,
				coordinates: { x: Number(msg.x), y: Number(msg.y) },
			},
			...state.slice(currentUserIndex + 1),
		]);
	};

	const changeMap = (msg: any) => {
		console.log('map selected', msg.map);
		setSelectedMap(msg.map);
	};

	useEffect(() => {
		console.log(sessionId);
	}, [sessionId]);

	useEffect(() => {
		if (socket) {
			setValue({
				sessionId: sessionId,
				userId: userId,
				users: users,
				socket: socket,
				map: selectedMap,
			});
		}
		console.log("set", sessionId, userId, users, selectedMap);
	}, [sessionId, userId, users, socket, selectedMap]);

	useEffect(() => {
		if (sessionId) {
			const socket = new WebSocket("wss://https://tarkov-map-server.onrender.com/");
			// const socket = new WebSocket('ws://localhost:5000/');
			setSocket(socket);
			socket.onopen = () => {
				console.log('connected');
				socket.send(
					JSON.stringify({
						id: sessionId,
						userId: userId,
						username: username,
						pinShown: false,
						method: 'connection',
					})
				);
				setInterval(() => {
					socket.send(
						JSON.stringify({
							id: sessionId,
							userId: userId,
							method: 'ping',
						})
					);
				}, 15000);
			};
		}
	}, [sessionId]);

	useEffect(() => {
		if (socket) {
			socket.onmessage = (event) => {
				let msg = JSON.parse(event.data);
				switch (msg.method) {
					case 'connection':
						console.log(`Новый пользователь`, msg);
						parseUsers(msg);
						changeMap(msg);
						break;
					case 'pin':
						console.log('pinned', msg);
						userActionHandler(msg);
						break;
					case 'disconnect':
						console.log('Disconnect', msg);
						parseUsers(msg);
						break;
					case 'mapChange':
						console.log('mapChange', msg);
						parseUsers(msg);
						changeMap(msg);
						break;
					case 'usernameChange':
						console.log('usernameChange', msg);
						parseUsers(msg);
						break;
				}
			};
		}
	}, [socket, users]);

	return (
		<SocketConnectionContext.Provider value={value}>
			{children}
		</SocketConnectionContext.Provider>
	);
}
