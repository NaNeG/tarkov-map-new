import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import customsMap from '../../img/maps/customs-monkix3.jpg';
import reserveMap from '../../img/maps/reserve-2d.jpg';
import shorelineMap from '../../img/maps/shoreline.jpg';
import lighthouseMap from '../../img/maps/lighthouse-landscape.jpg';
import mapPinBlack from '../../img/icons/map-pin-black.png';
import mapPinRed from '../../img/icons/map-pin-red.png';
import mapPinGreen from '../../img/icons/map-pin-green.png';
import mapPinBlue from '../../img/icons/map-pin-blue.png';
import mapPinPink from '../../img/icons/map-pin-pink.png';
import classes from './map.module.css';
import SocketConnectionContext from '../../store/SocketConnectionContext';
import { SocketContext } from '../../types/session.type';
import { colorIdToPinIcon } from '../../helpers/helpers';

const mapNameToImage: Record<string, string> = {
	customs: customsMap,
	shoreline: shorelineMap,
	reserve: reserveMap,
	lighthouse: lighthouseMap,
};

type MapProps = {
	username: string;
};

export default function Map(props: MapProps) {
	const { username } = props;

	const [scale, setScale] = useState(1);
	const [startCoords, setStartCoords] = useState({ x: 0, y: 0 });
	const mapRef = useRef<HTMLDivElement | null>(null);
	const pinRefs = useRef<HTMLElement[]>([]);

	const {
		sessionId: sessionId,
		userId,
		users,
		socket,
		map,
	} = useContext<SocketContext>(SocketConnectionContext);

	useEffect(() => {
		console.log('changed', sessionId, userId, users, socket);
	}, [sessionId, userId, users, socket]);

	// useEffect(() => {
	// 	setUsername(username);
	// }, [username]);

	const scrollHandler = (event: any) => {
		let newScale = Number((scale - event.deltaY / 500).toFixed(1));
		if (newScale >= 0.2 && newScale <= 3) {
			setScale(newScale);
		}
	};

	const imageMouseDownHandler = (event: any) => {
		let posX = event.pageX;
		let posY = event.pageY;
		setStartCoords({ x: posX, y: posY });
		console.log('pressed', posX, posY);
	};

	const imageTouchDownHandler = (event: any) => {
		var touch = event.touches[0] || event.changedTouches[0];
		let posX = touch.clientX;
		let posY = touch.clientY;
		setStartCoords({ x: posX, y: posY });
		console.log('pressed', posX, posY);
	};

	const imageMouseUpHandler = (event: any) => {
		let rect = event.target.getBoundingClientRect();
		let posX = event.pageX;
		let posY = event.pageY;
		let currX = event.clientX - rect.left;
		let currY = event.clientY - rect.top;
		console.log('released', posX, posY);
		if (
			Math.abs(posX - startCoords.x) === 0 &&
			Math.abs(posY - startCoords.y) === 0
		) {
			// console.log(socket, sessionId, userId, username);
			if (socket) {
				socket.send(
					JSON.stringify({
						id: sessionId,
						userId: userId,
						method: 'pin',
						x: (currX / scale).toFixed(0),
						y: (currY / scale).toFixed(0),
					})
				);
			}

			console.log((currX / scale).toFixed(0), (currY / scale).toFixed(0));
		}
	};

	const imageTouchUpHandler = (event: any) => {
		var touch = event.touches[0] || event.changedTouches[0];
		let rect = event.target.getBoundingClientRect();
		let posX = touch.clientX;
		let posY = touch.clientY;
		let currX = touch.clientX - rect.left;
		let currY = touch.clientY - rect.top;
		console.log('released', posX, posY);
		if (
			Math.abs(posX - startCoords.x) === 0 &&
			Math.abs(posY - startCoords.y) === 0
		) {
			// console.log(socket, sessionId, userId, username);
			if (socket) {
				socket.send(
					JSON.stringify({
						id: sessionId,
						userId: userId,
						method: 'pin',
						x: (currX / scale).toFixed(0),
						y: (currY / scale).toFixed(0),
					})
				);
			}

			console.log((currX / scale).toFixed(0), (currY / scale).toFixed(0));
		}
	};

	useEffect(() => {
		console.log('redraw', pinRefs, map);
		for (let userIndex = 0; userIndex < users.length; userIndex++) {
			if (users[userIndex].pinShown) {
				console.log(users[userIndex], pinRefs.current[userIndex]);
				let pinRect =
					pinRefs.current[userIndex].getBoundingClientRect();
				console.log(pinRect.top);
				pinRefs.current[userIndex].style.top = `${
					users[userIndex].coordinates.y -
					(pinRect.height / 2 + pinRect.height / (2 * scale))
				}px`;
				pinRefs.current[userIndex].style.left = `${
					users[userIndex].coordinates.x - pinRect.width / 2
				}px`;
				pinRefs.current[userIndex].style.transform = `scale(${
					1 / scale
				})`;
				// console.log('drawn', pinRect.height, pinRect.width);
			}
		}
	}, [scale, users]);

	useEffect(() => {
		if (mapRef.current)
			mapRef.current.style.transform = `scale(${scale})`;
		console.log(scale);
	}, [scale]);

	return (
		<div
			className={classes.container}
			onWheel={scrollHandler}
			id={'mapContainer'}
		>
			<Draggable>
				<div className={classes['draggable-container']}>
					<div ref={mapRef}>
						<img
							className={classes.map}
							draggable={false}
							src={mapNameToImage[map]}
							onMouseDown={imageMouseDownHandler}
							onTouchStart={imageTouchDownHandler}
							onMouseUp={imageMouseUpHandler}
							onTouchEnd={imageTouchUpHandler}
						/>
						{users.map((user, index) => (
							<img
								key={index}
								src={colorIdToPinIcon[user.pinColorId]}
								// src={mapPinBlack}
								// user={user}
								className={classes.mapPin}
								hidden={!user.pinShown}
								ref={(elem) =>
									elem
										? (pinRefs.current[index] = elem)
										: null
								}
							/>
						))}
					</div>
				</div>
			</Draggable>
		</div>
	);
}
