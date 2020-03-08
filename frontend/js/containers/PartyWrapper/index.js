import React, { Component } from 'react';
import WebSocketAsPromised from 'websocket-as-promised';

import JoinPartyName from '../../components/JoinParty';
import {CreatePartyName} from '../../components/CreateParty';
import ErrorMessage from '../../components/ErrorMessage';
import Loading from '../../components/Loading';
import PartyJoined from '../../components/PartyJoined';

class PartyWrapper extends Component {
	constructor(props) {
		super(props);
		const renderingHost = this.props.location.pathname == '/host';
		const renderingJoin = this.props.location.pathname == '/join';
		const renderingParty = this.props.location.pathname == '/party';
		const shouldAbort = 
			this.props.location.pathname == '/host' && (!this.props.location.state || !this.props.location.state.prevRoute || this.props.location.state.prevRoute != 'OAuthCallback')
			|| renderingParty // if rendering party in constructor, we should leave
		;
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
			user: shouldAbort || renderingJoin ? null : this.props.location.state.user,
			partyCode: null,
			partyName: null,
			partyBegun: false,
			songList: [],
			abortiveError: null,
			error: null,
		}
	}

	componentDidMount() {
		if (this.state.abort) {
      this.props.history.push('/');
		}
		else if(this.state.renderingHost) {
			this.socket.open()
				.then(this.setState({user: this.props.location.state.user}))
				.catch(error => {
					this.setState({abortiveError: error});
				});
		}
		else {
			this.socket.open()
				.catch(error => {
					this.setState({abortiveError: error});
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
		if (json.error) {
			this.setState({error: json.error});
		}
		else {
			switch (command) {
				case 'channel':
					if (json.hasOwnProperty('TODO: some property')) {

					}
					break;
				case 'party':
					if (json.hasOwnProperty('party_code')) {
						this.setState({partyCode: json.party_code, partyName: json.party_name, partyBegun: true});
						window.history.replaceState(null, null, '/party'); // allows us to change the URL w/o re-rendering
					}
					break
			}
		}
	}

	handlePartyCreate(partyName) {
		this.socket.sendRequest({
			'command': 'create',
			'name': partyName
		})
		.catch(error => this.setState({abortiveError: error})); // todo: more robust?
	}

	handlePartyJoin(partyCode, username) {
		this.setState({user: {name: username}})
		this.socket.sendRequest({
			'command': 'join',
			'user': username,
			'party': partyCode
		})
		.catch(error => this.setState({abortiveError: error})); // TODO: more robust?
	}

	handleSongAdd(item) {
		console.log(`${item.song_name} added!`);
	}

	render() {
		if (this.state.abort) {
			return <Loading />;
		}
		else if (this.state.abortiveError) {
			return(
				<ErrorMessage 
					header={'There was an error connecting to Director!'}
					headerSize={'2em'}
					message={`${this.state.abortiveError}\nPlease try refreshing the page.`}
					messageSize={'1em'}
				/>
			);
		}
		else if (this.state.partyBegun) {
			return (
				<PartyJoined 
					partyCode={this.state.partyCode}
					partyName={this.state.partyName}
					songList={this.state.songList}
					hosting={this.state.renderingHost}
					handleSongAdd={this.handleSongAdd.bind(this)}
				/>
			);
		}
  	else if (this.state.renderingHost) {
			return (
				<CreatePartyName
					user={this.state.user}
					handlePartyCreate={this.handlePartyCreate.bind(this)}
					error={this.state.error}
				/>
			);
		}
		else {
			return (
				<JoinPartyName
					handlePartyJoin={this.handlePartyJoin.bind(this)}
					error={this.state.error}
				/>
			);
		}
	}
}

export default PartyWrapper;
