import React from 'react';
import { Button } from 'reactstrap';

const CreatePartyName = (props) => {
	console.log(localStorage.getItem('token')) // TODO: delete
  return (
  	<div className="CreatePartyName">
  	  <div class="title">
	    	<h1>Name your party, {props.user.name}!</h1>
  		</div>

  		<div class="enterName">
	    	<input type="text"  value= "Party Name"/>
  		</div>

    	<div className="buttons">
	    	<Button className="button" color="success" > Launch Party!
	    		<small> Lets get rockin' </small>
	    	</Button>
  		</div>
  	</div>

  );
}

export default CreatePartyName;
