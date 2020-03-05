import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import '../css/MainScreen.css';
import { Button } from 'reactstrap';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap'  
import WebSocketAsPromised from 'websocket-as-promised';

class PartyJoined extends Component {
	constructor(props) {
		super(props);
		this.socket = new WebSocketAsPromised('ws://localhost:8000/ws/party/', {
			packMessage: data => JSON.stringify(data),
			unpackMessage: data => JSON.parse(data),
			attachRequestId: (data, id) => Object.assign({id}, data),
			extractRequestId: data => data && data.id
		});
		this.state = {
			songList: [],
			error: null,
		}
	}

	componentDidMount() {
		this.socket.onMessage.addListener(data => this.handleSocketMessage(data));
		this.socket.open()
			.catch(error => {
				this.setState({error: error});
			});
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

	render() {
  	return (
			<div className="PartyJoined">
				<div class="searchDiv">
						<Form class="searchBar" >
							<FormControl
								type="text"
								placeholder="Search"
								className="mr-sm-2"
							/>
						</Form>          
				</div>

				<div class="title">
					<h1>Song Queue </h1>
				</div>

				<div className="listViewSongQueue">
					<div class="list-group">
						<a href="#" class="list-group-item list-group-item-action listQueue">
							<div class="column left">
								<img class="albumArtwork" src="https://www.w3schools.com/images/w3schools_green.jpg" alt="W3Schools.com" />
							</div>

							<div class="column middle">Name of Song</div>

							<div class="column right buttonCard">
								<Button className="SkipButton" color="danger">Skip</Button>
							</div>
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default PartyJoined;
