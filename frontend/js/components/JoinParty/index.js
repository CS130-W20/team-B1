import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { Form } from 'react-bootstrap';

class JoinPartyName extends Component {
	constructor(props) {
		super(props);
		this.state = {
			partyCode: '',
			username: '',
			buttonPushed: false,
		}
	}

	componentDidUpdate() {
		if (this.props.error && this.state.buttonPushed) {
			this.setState({buttonPushed: false});
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
    if (event.key == 'Enter' && this.state.partyCode != '' && this.state.username != '') {
			this.setState({buttonPushed: true});
      this.props.handlePartyJoin(this.state.partyCode, this.state.username);
    }
  }

	render() {
		return (
			<div className="JoinPartyName">
				<div className="title">
					<h1>Almost Party Time!</h1>
				</div>

				<Form onSubmit={this.handleFormSubmit}>
					<Form.Group controlId="username" className="enterName">
						<Form.Control 
							name="username" 
							placeholder={'username'} 
							onChange={this.handleFormChange.bind(this)} 
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
					</Form.Group>
					<Form.Group controlId="partyCode" className="enterCode">
						<Form.Control 
							name="partyCode" 
							placeholder={'Party Code'} 
							onChange={this.handleFormChange.bind(this)} 
							onKeyPress={this.handleKeyPress.bind(this)}
						/>
					</Form.Group>
				</Form>

				{this.props.error ? <small className="error">{this.props.error}</small> : null}

				<div className="buttons">
					<Button 
						className="button" 
						color="success"
						onClick={() => {this.setState({buttonPushed: true}); this.props.handlePartyJoin(this.state.partyCode, this.state.username)}} 
						disabled={this.state.buttonPushed}
					> 
						Join party
						<small>Let's get rockin'</small>
					</Button>
				</div>
  		</div>
		);
	}
};

export default JoinPartyName;
