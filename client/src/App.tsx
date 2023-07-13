import { useState } from 'react';
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useRoutes,
} from 'react-router-dom';
import Map from './components/map/map';
import NavBar from './components/nav-bar/nav-bar';
import NameInput from './components/name-input/name-input';
import './global.css';
import SocketConnectionProvider from './store/SocketConnectionProvider';
import MapPage from './pages/map-page/map-page';

function App() {
	return (
		<SocketConnectionProvider>
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={
							<Navigate
								replace
								to={`f${(+new Date()).toString(16)}`}
							></Navigate>
						}
					></Route>
					<Route path='/:id' element={<MapPage />}></Route>
				</Routes>
			</BrowserRouter>
		</SocketConnectionProvider>
	);
}

export default App;
