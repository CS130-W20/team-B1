import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from '../../utils/history';

import MainScreen from '../../components/MainScreen';
import SpotifyLogin from '../../components/CreateParty/SpotifyLogin';
import ErrorMessage from '../../components/ErrorMessage';
import PartyJoined from '../../components/PartyJoined';
import OAuthCallback from '../../components/OAuthCallback';
import PartyWrapper from '../../containers/PartyWrapper';

const App = () => (
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={MainScreen} />
			<Route exact path="/host" component={PartyWrapper} />
			<Route exact path="/login" component={SpotifyLogin} />
			<Route exact path="/join" component={PartyWrapper} />
			<Route exact path="/party" component={PartyJoined} />
			<Route exact path="/callback" component={OAuthCallback} />
			<Route component={ErrorMessage}/> {/* This is the 404 fallback */}
		</Switch>
	</Router>
);

export default App;
