import React from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import '../css/MainScreen.css';
import { Button } from 'reactstrap';


const JoinPartyName = () => {
  return (
  	<div className="JoinPartyName">
  	    <div class="title">
	    	<h1>What is your name? </h1>
  		</div>

  		<div class="enterName">
	    	<input type="text"  value= "Name"/>
  		</div>

    	<div className="buttons">
	    	<Button className="button" color="success"> Join party
	    		<small> Lets get rockin' </small>
	    	</Button>
  		</div>
  	</div>

  );
}

export default JoinPartyName;
