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
		if (status === STATUS.ERROR && errorType === 'authentication_error') {
			localStorage.removeItem('token');
			// TODO: update token
			setToken('');
		}
		if (this.state.position < position && position >= 0) {
			this.setState({position: position});
		}
		
		let latestPreviousTrack = null;
		if (previousTracks.length > 0) { // previousTracks max length is capped at 2
			latestPreviousTrack = previousTracks.length == 2 ? previousTracks[1] : previousTracks[0];
		}
		const uri_to_match = latestPreviousTrack ? (latestPreviousTrack.linked_from_uri ? latestPreviousTrack.linked_from_uri : latestPreviousTrack.uri) : null;
		const newTrackLength = latestPreviousTrack != null ? this.props.songList.findIndex(ele => ele == uri_to_match) + 1 : 0;

		console.log(`~~~~~~~~~`)
		console.log(`latesTPreviousTrack: ${latestPreviousTrack}`);
		console.log(previousTracks)
		console.log(`newTrackLength: ${newTrackLength}`)
		console.log(`latestPreviousTrack.uri: ${uri_to_match}`)
		console.log(`this.state.songOffset: ${this.state.songOffset}`);
		console.log(`position: ${position}`);
		console.log(`this.state.position: ${this.state.position}`);
		console.log(this.props.songList)
		console.log(`~~~~~~~~~`)
		if (newTrackLength > this.state.songOffset) { // we disallow backtracking in the queue now || (newTrackLength == this.state.songOffset - 2)) {
			this.setState({songOffset: newTrackLength});
			this.props.advanceQueue();
		}
	}

	handleModal() {
		this.setState({showModal: !this.state.showModal});
	}

	handleSongAdd(data) {
		this.setState({showModal: false, autoPlay: false}); 
		this.props.handleSongAdd(data);
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

				<div className="queueResults">
					<div className="list-group">
						{this.props.queue.map((result, index) => (
							<div key={index} className="list-group-item list-group-item-action queueResult">
								<a href={result.url} target="_blank">
									<div className="column left">
										<img className="albumArtwork" src={result.album_art} alt={`${result.song_name} Album Art`} />
									</div>
									<div className="column middle songTitle">{result.song_name}</div>
									<div className="column middle songArtist">{result.artist_name}</div>
								</a>
								<div className="column right buttonCard">
									<Button className="AddButton" color="danger" onClick={() => this.props.handleSongSkip(result)}>Skip</Button>
								</div>
							</div>
						))}
					</div>
				</div>

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
