import React from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';
import '../css/MainScreen.css';

const MainScreen = (props) => (
  	<div className="MainScreen">
    	<div className="buttons">
	    	<Button className="button" color="success" onClick={() => { props.history.push('/login') }}>Create Party
	    		<small>It's your party to shine!</small>
	    	</Button>
		    <Button className="button" color="danger" onClick={() => { props.history.push('/join') }}>Join Party
		    	<small>Do you know a party code?</small>
		    </Button>
  		</div>
  	</div>
);

export default MainScreen;
