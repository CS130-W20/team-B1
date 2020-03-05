import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form } from 'react-bootstrap';

class CreatePartyName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partyName: '',
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
		if(event.key === 'Enter') {
			this.props.handlePartyCreate(this.state.partyName);
		} 
		event.preventDefault();
	}

	render() {
		return (
			<div className="CreatePartyName">
				<div className="title">
					<h1>Name your party, {this.props.user.name}!</h1>
				</div>

				<Form onSubmit={this.handleFormSubmit}>
					<Form.Group controlId="partyName" className="enterName">
						<Form.Control 
							name="partyName" 
							placeholder={`${this.props.user.name}\'s Party`} 
							onChange={this.handleFormChange.bind(this)} 
						/>
					</Form.Group>
				</Form>

				<div className="buttons">
					<Button 
						className="button" 
						color="success" 
						onClick={() => this.props.handlePartyCreate(this.state.partyName)} 
					> 
						Launch Party!
						<small> Lets get rockin' </small>
					</Button>
				</div>
			</div>
		);
	}
};

export default CreatePartyName;
