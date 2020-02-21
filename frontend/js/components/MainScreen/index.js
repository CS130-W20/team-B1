import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import '../css/MainScreen.css';
import { Button } from 'reactstrap';


const MainScreen = () => {
  return (
  	<div className="MainScreen">
    	<div className="buttons">
	    	<Button className="button" color="success">Create Party
	    		<small> You are the host </small>
	    	</Button>
		    <Button className="button" color="danger">Join Party
		    	<small> Are you near a host? </small>
		    </Button>
  		</div>
  	</div>

  );
}

export default MainScreen;
