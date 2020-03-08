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
			hosting: renderingHost,
			user: shouldAbort || renderingJoin ? null : this.props.location.state.user,
			partyCode: null,
			partyName: null,
			partyBegun: false,
			songList: [],
			songListOffset: 0,
			queue: [],
			abortiveError: null,
			error: null,
			partyRerouteDone: false,
		}
	}

	componentDidMount() {
		if (this.state.abort) {
      this.props.history.push('/');
		}
		else if(this.state.hosting) {
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

	componentDidUpdate() {
		if (this.state.abort) {
      this.props.history.push('/');
		}
		else if (this.state.partyBegun && !this.state.partyRerouteDone) {
			window.history.replaceState(null, null, '/party'); // allows us to change the URL w/o re-rendering
		}
	}

	startParty() {
		this.setState({partyBegun: true});
	}
 
	handleSocketMessage(data) {
		const json = JSON.parse(data)
		const command = json.command;
		if (json.error) {
			this.setState({error: json.error});
		}
		else {
			switch (command) {
				case 'vacate':
					this.setState({abort: true});
					break;
				case 'party':
					if (json.hasOwnProperty('party_code')) {
						this.setState({partyCode: json.party_code, partyName: json.party_name});
					}
					break
				case 'song_added':
					let song_data = json.song;
					delete song_data.command;
					delete song_data.id;
					this.setState({queue: [...this.state.queue, song_data], songList: [...this.state.songList, song_data.uri]})
					break
				case 'advance_queue':
					this.setState({queue: this.state.queue.slice(1), songListOffset: this.state.songListOffset + 1});
					break
			}
		}
	}

	handlePartyCreate(partyName) {
		this.socket.sendRequest({
			'command': 'create',
			'name': partyName
		})
		.catch(error => this.setState({error: error})); // todo: more robust?
	}

	handlePartyJoin(partyCode, username) {
		this.socket.sendRequest({
			'command': 'join',
			'user': username,
			'party': partyCode
		})
		.then(resp => {
			if (resp.status >= 400) {
				this.setState({error: resp.error});
			}
			else {
				console.log(resp);
				this.setState({user: {name: username}, partyBegun: true, queue: resp.queue.slice(resp.offset)});
			}
		})
		.catch(error => this.setState({error: error})); // TODO: more robust?
	}
	
	advanceQueue(newOffset) {
		this.socket.sendRequest({
			'command': 'advance_queue'
		});
	}

	handleSongAdd(data) {
		data['command'] = 'add_song'
		console.log(data)
		this.socket.sendRequest(data)
			.then(resp => {
				console.log("I'm here!")
				if (resp.status > 400) {
					console.log(error)
					this.setState({error: resp.message});
				}
			})
			.catch(error => this.setState({abortiveError: error.message}));
	}

	handleSongSkip(song) {
		this.socket.sendRequest({
			'command': 'request_skip'
		});
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
					hosting={this.state.hosting}
					handleSongAdd={this.handleSongAdd.bind(this)}
					queue={this.state.queue}
					advanceQueue={this.advanceQueue.bind(this)}
					handleSongSkip={this.handleSongSkip.bind(this)}
					songOffset={this.state.songListOffset}
				/>
			);
		}
  	else if (this.state.hosting) {
			return (
				<CreatePartyName
					user={this.state.user}
					handlePartyCreate={this.handlePartyCreate.bind(this)}
					handleSongAdd={this.handleSongAdd.bind(this)}
					handlePartyStart={this.startParty.bind(this)}
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
