import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form } from 'react-bootstrap';

import SearchModal from '../SearchModal';

class CreatePartyName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partyName: '',
			buttonPushed: false,
			firstSongAdded: false,
			secondSongAdded: false,
			showModal: false,
			showingFirst: false,
			namingParty: true,
		}
	}

	handleFormChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
		});
	}

	handleFormSubmit(event) {
		event.preventDefault();
	}

	handleKeyPress(event) {
		if (event.key == 'Enter' && this.namingParty && this.state.partyName != '') {
			this.setState({namingParty: false});
		}
    else if (event.key == 'Enter' && this.state.partyName != '' && this.state.firstSongAdded && this.state.secondSongAdded) {
			this.setState({buttonPushed: true}); 
			this.props.handlePartyCreate(this.state.partyName);
    }
	}

	handleModal() {
		if (this.state.showingFirst && !this.state.firstSongAdded) {
			this.setState({showingFirst: false});
		}
		this.setState({showModal: !this.state.showModal});
	}

	handleSongAdd(data) {
		if (this.state.showingFirst && !this.state.firstSongAdded) {
			this.setState({firstSongAdded: true});
		}
		else {
			this.setState({secondSongAdded: true});
		}
		this.handleModal();
		this.props.handleSongAdd(data);
	}

	handlePartyCreate() {
		if (this.state.partyName != '') {
			this.setState({namingParty: false})
			this.props.handlePartyCreate(this.state.partyName);
		}
	}

	addFirstSongClick() {
		this.handleModal();
		this.setState({showingFirst: true})
	}

	render() {
		console.log(this.state.namingParty)
		return (
			<div className="CreatePartyName">
				{this.state.namingParty ? 
					<div className="title">
						<h1>Name your party, {this.props.user.name}!</h1>
					</div>
					:
					<div className="title">
						<h1>Add two songs to start!</h1>
					</div>
				}
				<Form onSubmit={this.handleFormSubmit}>
					<Form.Group controlId="partyName" className="enterName">
						{this.state.namingParty ?
						<Form.Control 
							name="partyName" 
							placeholder={`${this.props.user.name}\'s Party`} 
							onChange={this.handleFormChange.bind(this)} 
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
						:
						<React.Fragment>
						<Button 
							variant="primary" 
							onClick={this.addFirstSongClick.bind(this)}
							color="success"
							disabled={this.state.firstSongAdded}
						>
							Add First Party Song
						</Button>
						<Button 
							variant="primary" 
							onClick={this.handleModal.bind(this)} 
							color="success"
							disabled={this.state.secondSongAdded}
						>
							Add Second Party Song
						</Button>
						</React.Fragment>
					 }
					</Form.Group>
				</Form>

				<SearchModal 
					show={this.state.showModal}
					handleClose={this.handleModal.bind(this)}
					handleSongAdd={this.handleSongAdd.bind(this)}
				/>
				{this.state.namingParty ?
					<div className="buttons">
						<Button 
							className="button" 
							color="success" 
							onClick={this.handlePartyCreate.bind(this)} 
							disabled={this.state.buttonPushed}
						> 
							Next Step
						</Button>
					</div>
					:
					<div className="buttons">
						<Button 
							className="button" 
							color="success" 
							onClick={this.props.handlePartyStart} 
							disabled={!this.state.firstSongAdded || !this.state.secondSongAdded}
						> 
							Launch Party!
							<small> Lets get rockin' </small>
						</Button>
					</div>
				}
			</div>
		);
	}
};

export default CreatePartyName;
