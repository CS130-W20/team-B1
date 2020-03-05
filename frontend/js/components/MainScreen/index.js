import React from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css';
import '../css/MainScreen.css';

const MainScreen = withRouter(({ history }) => (
  	<div className="MainScreen">
    	<div className="buttons">
	    	<Button className="button" color="success" onClick={() => { history.push('/login') }}>Create Party
	    		<small> You are the host </small>
	    	</Button>
		    <Button className="button" color="danger" onClick={() => { history.push('/join') }}>Join Party
		    	<small> Are you near a host? </small>
		    </Button>
  		</div>
  	</div>
));

export default MainScreen;
