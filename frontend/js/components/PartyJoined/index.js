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
			position: 0
		}
	}

	handleCallback({ status, errorType, position, track }) {
		const offset = this.props.songList.findIndex(ele => ele == track.uri);
		console.log(`offset: ${offset}`)
		console.log(`this.state.songOffset: ${this.state.songOffset}`);
		if (status === STATUS.ERROR && errorType === 'authentication_error') {
			localStorage.removeItem('token');
			// TODO: update token
			setToken('');
		}
		else if (this.state.songOffset < offset) {
			this.setState({songOffset: offset});
		}
		this.setState({position: position})
	}

	handleModal() {
		this.setState({showModal: !this.state.showModal});
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
					handleSongAdd={(data) => {this.setState({showModal: false}); this.props.handleSongAdd(data)}}
				/>

				<div className="title">
					<h1>Song Queue </h1>
				</div>

				{this.props.error ? <small className="error">{this.props.error}</small> : null}

				{
					this.props.hosting ?
					<SpotifyWebPlayer
						autoPlay
						callback={this.handleCallback.bind(this)}
						persistDeviceSelection
						play={false}
						magnifySliderOnHover
						showSaveIcon
						token={localStorage.getItem('token')}
						styles={{
							sliderColor: '#1cb954',
						}}
						offset={this.state.songOffset}
						className="fixedToBottom"
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
