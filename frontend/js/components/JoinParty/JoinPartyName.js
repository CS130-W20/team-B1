import React from 'react';
import { Button } from 'reactstrap';


const JoinPartyName = () => {
  return (
  	<div className="JoinPartyName">
			<div class="title">
				<h1>Almost Party Time!</h1>
			</div>

			<div class="enterName">
				<input type="text"  value= "Name"/>
			</div>

			<div class="enterCode">
				<input type="text"  value= "Party Code"/>
			</div>

			<div className="buttons">
				<Button className="button" color="success"> Join party
					<small>Let's get rockin'</small>
				</Button>
			</div>
  	</div>

  );
}

export default JoinPartyName;
