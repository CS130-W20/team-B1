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
		}
	}

	handleCallback({ status, errorType, position }) {
		if (status === STATUS.ERROR && errorType === 'authentication_error') {
			localStorage.removeItem('token');
			// TODO: update token
			setToken('');
			console.log(position)
		}
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
					handleSongAdd={this.props.handleSongAdd}
				/>

				<div className="title">
					<h1>Song Queue </h1>
				</div>

				{
					this.props.hosting ?
					<SpotifyWebPlayer
						autoPlay
						callback={this.handleCallback}
						persistDeviceSelection
						play={false}
						magnifySliderOnHover
						showSaveIcon
						token={localStorage.getItem('token')}
						styles={{
							sliderColor: '#1cb954',
						}}
						uris={this.props.songList}
					/>
					:
					null
				}
			</div>
		);
	}
}

export default PartyJoined;
