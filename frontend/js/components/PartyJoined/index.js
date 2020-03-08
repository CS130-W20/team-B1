import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'  
import SpotifyWebPlayer, { STATUS } from 'react-spotify-web-playback';

import '../css/SpotifyPlayer.css';

class PartyJoined extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
		}
	}

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	handleCallback({ status, errorType, position }) {
		if (status === STATUS.ERROR && errorType === 'authentication_error') {
			localStorage.removeItem('token');
			// TODO: update token
			setToken('');
			console.log(position)
		}
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
				<div className="searchDiv">
						<Form className="searchBar" >
							<FormControl
								type="text"
								placeholder="Search"
								className="mr-sm-2"
							/>
						</Form>          
				</div>

				<div className="title">
					<h1>Song Queue </h1>
				</div>

				<div className="listViewSongQueue">
					renderQueueItems(this.props.queue)
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
