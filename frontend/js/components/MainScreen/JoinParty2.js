import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/MainScreen.css';
import { Button } from 'reactstrap';


const JoinParty2 = () => {
  return (
  	<div className="JoinParty2">
  	    <div class="title">
	    	<h1>What is your name? </h1>
  		</div>

  		<div class="enterName">
	    	<input type="text"  value= "Name"/>
  		</div>

    	<div className="buttons">
	    	<Button className="button" color="success">Login to Spotify
	    		<small> Lets get rockin' </small>
	    	</Button>
  		</div>
  	</div>

  );
}

export default JoinParty2;
