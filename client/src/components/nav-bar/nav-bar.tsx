import { useContext, useEffect, useState } from "react";
import SocketConnectionContext from "../../store/SocketConnectionContext";
import classes from './nav-bar.module.css';

export default function NavBar() {
	const [selectedMap, setSelectedMap] = useState('');
	const {
		sessionId,
		userId,
		users,
		socket,
		map
	} = useContext(SocketConnectionContext);

	const mapSelectionHandler = (event: any) => {
		setSelectedMap(event.target.value);
	};

	useEffect(() => {
		if (map !== selectedMap) {
			console.log('map option change');
			setSelectedMap(map);
		}
	}, [map]);

	useEffect(() => {
		if (map !== selectedMap && socket && socket.readyState === WebSocket.OPEN) {
			socket.send(
				JSON.stringify({
					id: sessionId,
					userId: userId,
					method: "mapChange",
					map: selectedMap,
				})
			);
		}
	}, [selectedMap, socket]);

	return (
		<div className={classes.navBar}>
			<h2 className={classes.header}>Map</h2>
			<select value={selectedMap} onChange={mapSelectionHandler} id="mapSelect" className={classes.mapSelect}>
				<option value="customs">Customs</option>
				<option value="reserve">Reserve</option>
				<option value="shoreline">Shoreline</option>
			</select>
		</div>
	);
}
