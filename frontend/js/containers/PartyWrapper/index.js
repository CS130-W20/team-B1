import React, { Component } from 'react';
import WebSocketAsPromised from 'websocket-as-promised';

import JoinPartyName from '../../components/JoinParty';
import {CreatePartyName} from '../../components/CreateParty';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';

class PartyWrapper extends Component {
	constructor(props) {
		super(props);
		const renderingHost = this.props.location.pathname == '/host';
		const shouldAbort = this.props.location.pathname == '/host' && (!this.props.location.state || !this.props.location.state.prevRoute || this.props.location.state.prevRoute != 'OAuthCallback');
		this.socket = new WebSocketAsPromised('ws://localhost:8000/ws/party/', {
			createWebSocket: url => renderingHost ? new WebSocket(url, ['Token', localStorage.getItem('token')]) : new WebSocket(url),
			packMessage: data => JSON.stringify(data),
			unpackMessage: data => JSON.parse(data),
			attachRequestId: (data, id) => Object.assign({id}, data),
			extractRequestId: data => data && data.id
		});
		this.socket.onMessage.addListener(data => this.handleSocketMessage(data));
		this.state = {
			abort: shouldAbort,
			renderingHost: renderingHost,
			user: shouldAbort ? null : this.props.location.state.user,
		}
	}

	componentDidMount() {
		if (this.state.abort) {
      this.props.history.push('/login');
		}
		else {
			this.socket.open()
				.then(this.setState({user: this.props.location.state.user}))
				.catch(error => {
					this.setState({error: error});
				});
		}
	}

	componentWillUnmount() {
		this.socket.removeAllListeners();
		this.socket.close()
			.catch(error => {
				console.log("~~~ Socket Close Failure ~~~");
				console.log(error);
			});
	}

	handleSocketMessage(data) {
		const json = JSON.parse(data)
		const command = json.command;
		switch (command) {
			case 'channel':
				if (json.hasOwnProperty('TODO: some property')) {

				}
		}
	}

	handlePartyCreate(partyName) {
		this.socket.sendRequest({
			'command': 'create',
			'name': partyName
		});
	}

	render() {
		if (this.state.abort) {
			return <Loading />;
		}
		else if (this.state.error) {
			return(
				<ErrorMessage 
					header={'Could not establish connection to Director!'}
					headerSize={'2em'}
					message={`${this.state.error}\nPlease try refreshing the page.`}
					messageSize={'1em'}
				/>
			);
		}
  	else if (this.state.renderingHost) {
			return (
				<CreatePartyName
					user={this.state.user}
					handlePartyCreate={this.handlePartyCreate.bind(this)}
				/>
			);
		}
		else {
			return (
				<JoinPartyName />
			);
		}
	}
}

export default PartyWrapper;
