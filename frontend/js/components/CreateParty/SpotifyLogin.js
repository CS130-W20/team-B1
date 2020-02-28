import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Route } from 'react-router';

import { loginWithSpotify } from '../../utils/api';

// import 'bootstrap/dist/css/bootstrap.css';
// import '../css/MainScreen.css';

class SpotifyLogin extends Component {
	constructor() {
    super();
    this.state = {
			redirect: false,
			oauthURL: null,
		};
  }

	handleLogin() {
		loginWithSpotify().then(json => {
			this.setState({oauthURL: json['location'], redirect: true})
		});
	}
	
	render () {
		if (this.state.redirect) {
			return <Route path='/login' component={() => { 
				window.location.href = this.state.oauthURL; 
				return null;
	 		}}/>;
		}

		return (
			<div className="SpotifyLogin">
				<div className="buttons">
					<Button className="button" color="success" onClick={this.handleLogin.bind(this)}> Login to Spotify
						<small> You are the life of the party! </small>
					</Button>
				</div>
			</div>
		);
	}
}

export default SpotifyLogin;
