import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import { history } from '../../utils/history';

import MainScreen from '../../components/MainScreen';
import SpotifyLogin from '../../components/CreateParty/SpotifyLogin';
import CreatePartyName from '../../components/CreateParty/CreatePartyName';
import JoinPartyName from '../../components/JoinParty/JoinPartyName';
import JoinPartyList from '../../components/JoinParty/JoinPartyList';
import PartyJoined from '../../components/PartyJoined';
import OAuthCallback from '../../components/OAuthCallback';

const App = () => (
	<Router history={history}>
		<Switch>
			<Route exact path="/" component={MainScreen} />
			<Route exact path="/host" component={CreatePartyName} />
			<Route exact path="/login" component={SpotifyLogin} />
			<Route exact path="/join" component={JoinPartyName} />
			<Route exact path="/party" component={PartyJoined} /> {/* TODO: need to make URL tied to paty id/name */}
			<Route exact path="/callback" component={OAuthCallback} /> {/* TODO: need to make this restricted */}
		</Switch>
	</Router>
);

export default App;
