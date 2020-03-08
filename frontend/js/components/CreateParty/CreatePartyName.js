import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form } from 'react-bootstrap';

class CreatePartyName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partyName: '',
			buttonPushed: false,
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
    if (event.key == 'Enter' && this.state.partyName != '') {
			this.setState({buttonPushed: true}); 
			this.props.handlePartyCreate(this.state.partyName);
    }
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
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
					</Form.Group>
				</Form>

				<div className="buttons">
					<Button 
						className="button" 
						color="success" 
						onClick={() => {this.setState({buttonPushed: true}); this.props.handlePartyCreate(this.state.partyName)}} 
						disabled={this.state.buttonPushed}
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
