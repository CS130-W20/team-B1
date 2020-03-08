import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form, FormControl } from 'react-bootstrap'  
import SpotifyWebPlayer, { STATUS } from 'react-spotify-web-playback';

import SearchModal from '../SearchModal';

import '../css/SpotifyPlayer.css';

class PartyJoined extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			showModal: false,
			songOffset: 0,
			position: 0,
			autoPlay: true,
		}
	}

	handleCallback({ status, errorType, position, previousTracks }) {
		console.log(`~~~~~~~~~`)
		console.log(`previousTracks:`)
		console.log(previousTracks)
		console.log(`this.state.songOffset: ${this.state.songOffset}`);
		console.log(`position: ${position}`);
		console.log(`this.state.position: ${this.state.position}`);
		console.log(`~~~~~~~~~`)
		if (status === STATUS.ERROR && errorType === 'authentication_error') {
			localStorage.removeItem('token');
			// TODO: update token
			setToken('');
		}
		if (this.state.position < position && position >= 0) {
			this.setState({position: position});
		}
		if (previousTracks.length > this.state.songOffset || previousTracks.length == this.state.songOffset) {
			this.setState({songOffset: previousTracks.length});
		}
	}

	handleModal() {
		this.setState({showModal: !this.state.showModal});
	}

	handleSongAdd(data) {
		this.setState({showModal: false, autoPlay: false}); 
		this.props.handleSongAdd(data);
	}
	
	renderQueueItems(props) {
  		return (
  			<div className="list-group">
				<a href="#" className="list-group-item list-group-item-action listQueue">
					<div className="column left">
						<img className="albumArtwork" src={this.props.queue.albumArtwork} alt="cover" />
					</div>

					<div className="column middle">src={this.props.queue.songName} </div>

					<div className="column right buttonCard">
						<Button className="SkipButton" color="danger" onclick="skipSong()"> Skip </Button>
					</div>
				</a>
			</div>
  		);
	}

	render() {
		console.log(`songList: ${this.props.songList}`)
  	return (
			<div className="PartyJoined">
				<div className="title">
					<h1>{`${this.props.partyName} [Code: ${this.props.partyCode}]`}</h1>
				</div>

				<Button 
					variant="primary" 
					onClick={this.handleModal.bind(this)} 
					color="success"
					disabled={this.state.showModal}
				>
					Add Song
				</Button>

				<SearchModal 
					show={this.state.showModal}
					handleClose={this.handleModal.bind(this)}
					handleSongAdd={this.handleSongAdd.bind(this)}
				/>

				<div className="title">
					<h1>Song Queue </h1>
				</div>

				{this.props.error ? <small className="error">{this.props.error}</small> : null}

				{
					this.props.hosting ?
					<SpotifyWebPlayer
						autoPlay={this.state.autoPlay}
						callback={this.handleCallback.bind(this)}
						persistDeviceSelection
						play={false}
						magnifySliderOnHover
						showSaveIcon
						token={localStorage.getItem('token')}
						styles={{
							sliderColor: '#1cb954',
						}}
						name={'Director Web Player'}
						offset={this.state.songOffset}
						uris={this.props.songList}
						position={this.state.position}
					/>
					:
					null
				}
			</div>
		);
	}
}

export default PartyJoined;
